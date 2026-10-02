import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useI18n } from '../i18n/I18nContext';
import { fetchServerData } from '../api/ogame';
import { useApiData } from '../api/useApiData';
import { useUniverse } from '../universe/UniverseContext';
import { Group, ToolGrid } from '../components/Layout';
import {
	ATTACKER_SHIPS,
	DEFAULT_PLUNDER_RATIO,
	DEFAULT_RUNS,
	DEFENDER_SHIPS,
	DEFENSES,
	MAX_TECH_LEVEL,
	PLUNDER_CHOICES,
	RUN_CHOICES,
	buildBattle,
	describeOutcome,
	readUniverse,
} from './formulas';
import { useCombatSimulation } from './useCombatSimulation';
import TechInputs from './components/TechInputs';
import UnitGrid from './components/UnitGrid';
import PlanetResources from './components/PlanetResources';
import CombatResult from './components/CombatResult';

const EMPTY_SIDE = { techs: {}, ships: {}, defenses: {} };

function Combat() {
	const { t } = useI18n();
	const { selection } = useUniverse();
	const [attacker, setAttacker] = useState(EMPTY_SIDE);
	const [defender, setDefender] = useState(EMPTY_SIDE);
	const [hyperspaceLevel, setHyperspaceLevel] = useState('');
	const [resources, setResources] = useState({});
	const [plunderRatio, setPlunderRatio] = useState(DEFAULT_PLUNDER_RATIO);
	const [runs, setRuns] = useState(DEFAULT_RUNS);
	const [lastRun, setLastRun] = useState(null);
	const simulation = useCombatSimulation();
	const reportRef = useRef(null);

	// Under 1180px the report sits below a long form: bring it into view once
	// the battles are done. Beside the form, it is already there.
	useEffect(() => {
		if (simulation.status === 'done') {
			reportRef.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
		}
	}, [simulation.status, simulation.stats]);

	const { data, error, loading } = useApiData(
		selection.universe ? (signal) => fetchServerData(selection, { signal }) : null,
		[selection.universe, selection.lang],
	);

	const built = useMemo(
		() => buildBattle({ attacker, defender, resources, hyperspaceLevel, plunderRatio, runs, data }),
		[attacker, defender, resources, hyperspaceLevel, plunderRatio, runs, data],
	);

	// The report keeps the last outcome while the form changes, and says so.
	const battleKey = built.ok ? JSON.stringify(built.battle) : null;
	const outcome = useMemo(
		() => (simulation.status === 'done' && simulation.stats ? describeOutcome(simulation.stats) : null),
		[simulation.status, simulation.stats],
	);

	function update(setSide, part) {
		return (key, value) => setSide((prev) => ({ ...prev, [part]: { ...prev[part], [key]: value } }));
	}

	function handleSimulate(e) {
		e.preventDefault();
		if (!built.ok) return;
		setLastRun({ key: battleKey, universe: built.universe });
		simulation.run(built.battle);
	}

	const universeName = data ? data.name || t('srv.unnamed', { number: data.number }) : '';

	return (
		<ToolGrid
			settings={
				<form className="cs-form" onSubmit={handleSimulate}>
					<Group title={t('cs.step.attacker')} help={t('cs.step.attacker.help', { max: MAX_TECH_LEVEL })}>
						<TechInputs
							levels={attacker.techs}
							onChange={update(setAttacker, 'techs')}
							idPrefix="cs-att"
							extra={
								<div className="mini-field">
									<label htmlFor="cs-att-hyperspace">{t('cs.tech.hyperspace')}</label>
									<input
										id="cs-att-hyperspace"
										type="text"
										inputMode="numeric"
										autoComplete="off"
										placeholder="0"
										value={hyperspaceLevel}
										onChange={(e) => setHyperspaceLevel(e.target.value.replace(/\D/g, ''))}
									/>
								</div>
							}
						/>
						<UnitGrid
							ids={ATTACKER_SHIPS}
							counts={attacker.ships}
							onChange={update(setAttacker, 'ships')}
							idPrefix="cs-att-ship"
						/>
					</Group>

					<Group title={t('cs.step.defender')} help={t('cs.step.defender.help')}>
						<TechInputs levels={defender.techs} onChange={update(setDefender, 'techs')} idPrefix="cs-def" />
						<h3 className="cs-subtitle">{t('cs.ships')}</h3>
						<UnitGrid
							ids={DEFENDER_SHIPS}
							counts={defender.ships}
							onChange={update(setDefender, 'ships')}
							idPrefix="cs-def-ship"
						/>
						<h3 className="cs-subtitle">{t('cs.defenses')}</h3>
						<UnitGrid
							ids={DEFENSES}
							counts={defender.defenses}
							onChange={update(setDefender, 'defenses')}
							idPrefix="cs-def-defense"
						/>
					</Group>

					<Group title={t('cs.step.resources')} help={t('cs.step.resources.help')}>
						<PlanetResources
							values={resources}
							onChange={(key, value) => setResources((prev) => ({ ...prev, [key]: value }))}
						/>
						<div className="cs-choice">
							<span className="cs-choice-label" id="cs-plunder-label">
								{t('cs.plunder')}
							</span>
							<div className="chips" role="group" aria-labelledby="cs-plunder-label">
								{PLUNDER_CHOICES.map((ratio) => (
									<button
										key={ratio}
										type="button"
										className={`chip ${ratio === plunderRatio ? 'is-active' : ''}`}
										aria-pressed={ratio === plunderRatio}
										onClick={() => setPlunderRatio(ratio)}
									>
										{ratio * 100} %
									</button>
								))}
							</div>
						</div>
					</Group>

					<Group title={t('cs.step.run')} help={t('cs.step.run.help')}>
						<div className="cs-choice">
							<span className="cs-choice-label" id="cs-runs-label">
								{t('cs.runs')}
							</span>
							<div className="chips" role="group" aria-labelledby="cs-runs-label">
								{RUN_CHOICES.map((choice) => (
									<button
										key={choice}
										type="button"
										className={`chip ${choice === runs ? 'is-active' : ''}`}
										aria-pressed={choice === runs}
										onClick={() => setRuns(choice)}
									>
										{choice}
									</button>
								))}
							</div>
						</div>
						<button type="submit" className="btn cs-submit" disabled={simulation.status === 'running'}>
							{t('cs.simulate')}
						</button>
					</Group>
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
						outcome={outcome}
						stale={Boolean(outcome && lastRun && lastRun.key !== battleKey)}
						universe={lastRun?.universe ?? readUniverse(data)}
						universeName={universeName}
					/>
				</div>
			}
		/>
	);
}

export default Combat;
