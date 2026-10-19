import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { Group, ToolGrid } from '../components/Layout';
import {
	DEFAULT_PLUNDER_RATIO,
	DEFAULT_RUNS,
	MAX_TECH_LEVEL,
	PLUNDER_CHOICES,
	RUN_CHOICES,
	buildBattle,
	describeOutcome,
	nextWave,
	readUniverse,
} from './formulas';
import { useCombatSimulation } from './useCombatSimulation';
import FleetTable from './components/FleetTable';
import PlanetTable from './components/PlanetTable';
import CombatResult from './components/CombatResult';
import SpyImport from './components/SpyImport';

const EMPTY_ATTACKER = { techs: {}, ships: {} };
const EMPTY_DEFENDER = { techs: {}, ships: {}, defenses: {} };
const EMPTY_FORM = {
	attacker: EMPTY_ATTACKER,
	defender: EMPTY_DEFENDER,
	resources: {},
	plunderRatio: DEFAULT_PLUNDER_RATIO,
	runs: DEFAULT_RUNS,
};

export const COMBAT_STORAGE_KEY = 'og_ui_combat';

// Players come back to tune the same raid: the form outlives a reload.
function readStoredForm() {
	try {
		const stored = JSON.parse(localStorage.getItem(COMBAT_STORAGE_KEY));
		if (stored && typeof stored === 'object') {
			return {
				attacker: { ...EMPTY_ATTACKER, ...stored.attacker },
				defender: { ...EMPTY_DEFENDER, ...stored.defender },
				resources: stored.resources ?? {},
				plunderRatio: PLUNDER_CHOICES.includes(stored.plunderRatio) ? stored.plunderRatio : DEFAULT_PLUNDER_RATIO,
				runs: RUN_CHOICES.includes(stored.runs) ? stored.runs : DEFAULT_RUNS,
			};
		}
	} catch {
		// Unreadable or blocked storage: start from an empty form.
	}
	return EMPTY_FORM;
}

// Long enough to let a number be typed, short enough to feel live.
const AUTO_RUN_DELAY = 350;

// A row of segmented choices: the loot share, the number of battles.
function Choice({ id, label, choices, value, onChange, format }) {
	return (
		<div className="cs-choice">
			<span className="cs-choice-label" id={id}>
				{label}
			</span>
			<div className="chips" role="group" aria-labelledby={id}>
				{choices.map((choice) => (
					<button
						key={choice}
						type="button"
						className={`chip ${choice === value ? 'is-active' : ''}`}
						aria-pressed={choice === value}
						onClick={() => onChange(choice)}
					>
						{format(choice)}
					</button>
				))}
			</div>
		</div>
	);
}

function Combat() {
	const { t } = useI18n();
	const { selection } = useUniverse();
	const [form, setForm] = useState(readStoredForm);
	const { attacker, defender, resources, plunderRatio, runs } = form;
	const [lastRun, setLastRun] = useState(null);
	const simulation = useCombatSimulation();
	const reportRef = useRef(null);

	const update = useCallback((changes) => setForm((prev) => ({ ...prev, ...changes })), []);
	const updatePart = (sideKey, part, key, value) =>
		setForm((prev) => ({
			...prev,
			[sideKey]: { ...prev[sideKey], [part]: { ...prev[sideKey][part], [key]: value } },
		}));

	useEffect(() => {
		try {
			localStorage.setItem(COMBAT_STORAGE_KEY, JSON.stringify(form));
		} catch {
			// Remembering is a convenience; the simulator still works.
		}
	}, [form]);

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const built = useMemo(
		() => buildBattle({
				attacker,
				defender,
				resources,
				hyperspaceLevel: attacker.techs.hyperspace,
				plunderRatio,
				runs,
				data,
			}),
		[attacker, defender, resources, plunderRatio, runs, data],
	);

	const battleKey = built.ok ? JSON.stringify(built.battle) : null;
	const builtRef = useRef(built);
	builtRef.current = built;

	const start = useCallback(() => {
		const current = builtRef.current;
		if (!current.ok) return;
		setLastRun({ key: JSON.stringify(current.battle), universe: current.universe });
		simulation.run(current.battle);
	}, [simulation.run]);

	// Every change runs the battles again, once the typing pauses: no button to
	// remember, and the report never shows figures for another fight.
	useEffect(() => {
		if (!battleKey) return undefined;
		const timer = setTimeout(start, AUTO_RUN_DELAY);
		return () => clearTimeout(timer);
	}, [battleKey, start]);

	// Under 1180px the report sits below a long form: the button brings it
	// into view once the battles it asked for are done.
	const scrollOnDone = useRef(false);
	useEffect(() => {
		if (simulation.status === 'done' && scrollOnDone.current) {
			scrollOnDone.current = false;
			reportRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
		}
	}, [simulation.status, simulation.stats]);

	const outcome = useMemo(
		() => (simulation.stats ? describeOutcome(simulation.stats) : null),
		[simulation.stats],
	);

	function handleSimulate(e) {
		e.preventDefault();
		scrollOnDone.current = true;
		start();
	}

	// A report replaces what it shows. Without its research section (too few
	// probes), the technologies already typed stay.
	function handleSpyImport(found) {
		const hasTechs = Object.keys(found.techs).length > 0;
		setForm((prev) => ({
			...prev,
			defender: {
				techs: hasTechs ? found.techs : prev.defender.techs,
				ships: found.ships,
				defenses: found.defenses,
			},
			resources: found.resources,
		}));
	}

	function handleNextWave() {
		if (!outcome) return;
		setForm((prev) => ({ ...prev, ...nextWave(prev, outcome) }));
	}

	// The report is behind the form while a run is pending or under way.
	const busy = simulation.status === 'running' || Boolean(lastRun && lastRun.key !== battleKey);

	const universeName = data ? data.name || t('srv.unnamed', { number: data.number }) : '';

	return (
		<ToolGrid
			layout="wide"
			settings={
				<form className="cs-form" onSubmit={handleSimulate}>
					<SpyImport onImport={handleSpyImport} />

					<Group title={t('cs.sheet.fleets')} help={t('cs.sheet.fleets.help', { max: MAX_TECH_LEVEL })}>
						<FleetTable
							attacker={attacker}
							defender={defender}
							onChange={updatePart}
							onClear={(side) =>
								update(side === 'attacker' ? { attacker: EMPTY_ATTACKER } : { defender: { ...EMPTY_DEFENDER, defenses: defender.defenses } })
							}
						/>
					</Group>

					<div className="cs-aside">
						<Group title={t('cs.sheet.planet')} help={t('cs.sheet.planet.help')}>
							<PlanetTable
								defenses={defender.defenses}
								resources={resources}
								onDefense={(id, value) => updatePart('defender', 'defenses', id, value)}
								onResource={(key, value) => update({ resources: { ...resources, [key]: value } })}
								onClear={() => update({ defender: { ...defender, defenses: {} }, resources: {} })}
							/>
						</Group>

						<Group title={t('cs.step.run')} help={t('cs.step.run.help')}>
							<Choice
								id="cs-plunder-label"
								label={t('cs.plunder')}
								choices={PLUNDER_CHOICES}
								value={plunderRatio}
								onChange={(value) => update({ plunderRatio: value })}
								format={(ratio) => `${ratio * 100} %`}
							/>
							<Choice
								id="cs-runs-label"
								label={t('cs.runs')}
								choices={RUN_CHOICES}
								value={runs}
								onChange={(value) => update({ runs: value })}
								format={String}
							/>
							<div className="cs-actions">
								<button type="submit" className="btn cs-submit" disabled={!built.ok}>
									{t('cs.simulate')}
								</button>
								<button type="button" className="btn btn-quiet" onClick={() => setForm(EMPTY_FORM)}>
									{t('cs.reset')}
								</button>
							</div>
						</Group>
					</div>
				</form>
			}
			report={
				<div ref={reportRef}>
					{loading && <p className="help">{t('srv.loading')}</p>}
					{error && (
						<p className="api-error" role="alert">
							{t('srv.error.data')} <span className="api-error-detail">{error.message}</span>
						</p>
					)}
					<CombatResult
						error={built.ok ? null : built.error}
						simulation={simulation}
						outcome={built.ok ? outcome : null}
						busy={busy}
						universe={lastRun?.universe ?? readUniverse(data)}
						universeName={universeName}
						onNextWave={handleNextWave}
					/>
				</div>
			}
		/>
	);
}

export default Combat;
