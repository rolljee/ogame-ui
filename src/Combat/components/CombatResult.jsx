import React from 'react';
import Ogame from 'ogamejs';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import ResourceIcon from '../../components/ResourceIcon';
import { DEFENDER_SHIPS, DEFENSES, unitModel } from '../formulas';

const UNIT_ORDER = [...DEFENDER_SHIPS, ...DEFENSES];

// Same go / maybe / no-go bands as the moonbreak odds.
const HIGH_ODDS = 95;
const LOW_ODDS = 50;

const RESOURCES = [
	{ key: 'metal', resource: 'metal' },
	{ key: 'crystal', resource: 'crystal' },
	{ key: 'deuterium', resource: 'deut' },
];

function amount(value) {
	const rounded = Math.round(value);
	return rounded < 0 ? `−${groupDigits(-rounded)}` : groupDigits(rounded);
}

// One decimal, with the decimal mark of the language.
function decimal(value, lang) {
	const text = String(Math.round(value * 10) / 10);
	return lang === 'fr' ? text.replace('.', ',') : text;
}

// Counts are averages: one decimal while they are small enough for it to matter.
function count(value, lang) {
	return value >= 100 ? groupDigits(Math.round(value)) : decimal(value, lang);
}

function factor(value) {
	return Math.round(value * 1000) / 10;
}

function sum(resources) {
	return resources.metal + resources.crystal + resources.deuterium;
}

// The share of wins, draws and defeats in one bar, read left to right.
function OutcomeBar({ outcomes }) {
	const { t, lang } = useI18n();
	const parts = ['attacker', 'draw', 'defender'];

	return (
		<div className="cs-odds">
			<div className="cs-odds-bar" aria-hidden="true">
				{parts.map((part) =>
					outcomes[part] > 0 ? (
						<span key={part} className={`is-${part}`} style={{ flexGrow: outcomes[part] }} />
					) : null,
				)}
			</div>
			<ul className="cs-odds-legend">
				{parts.map((part) => (
					<li key={part} className={`is-${part}`}>
						{t(`cs.result.odds.${part}`)} <strong>{decimal(outcomes[part] * 100, lang)} %</strong>
					</li>
				))}
			</ul>
		</div>
	);
}

function byId(entries) {
	return new Map(entries.map(({ id, count: value }) => [id, value]));
}

// Every unit of the battle, one row each: what each side lost out of what it
// brought, as the in-game report lists them.
function UnitTable({ outcome, order }) {
	const { t, lang } = useI18n();
	const sides = {
		attacker: { lost: byId(outcome.attacker.losses), left: byId(outcome.attacker.survivors) },
		defender: {
			lost: byId(outcome.defender.losses),
			left: byId(outcome.defender.survivors),
			rebuilt: byId(outcome.defender.rebuilt),
		},
	};
	const ids = order.filter((id) =>
		Object.values(sides).some(({ lost, left }) => lost.has(id) || left.has(id)),
	);

	function cell(side, id) {
		const { lost, left, rebuilt } = sides[side];
		if (!lost.has(id) && !left.has(id)) return <td key={side} className="cs-unit-none" />;
		const lostCount = lost.get(id) ?? 0;
		const total = lostCount + (left.get(id) ?? 0);
		const back = rebuilt?.get(id) ?? 0;
		return (
			<td key={side}>
				<span className={lostCount > 0 ? 'cs-unit-lost' : 'cs-unit-safe'}>
					{lostCount > 0 ? `−${count(lostCount, lang)}` : '0'}
				</span>
				<span className="cs-unit-total"> / {count(total, lang)}</span>
				{back > 0 && (
					<span className="cs-unit-rebuilt">{t('cs.result.rebuilt', { count: count(back, lang) })}</span>
				)}
			</td>
		);
	}

	return (
		<div className="cs-table-wrap">
			<table className="cs-table cs-units">
				<caption className="cs-subtitle">{t('cs.result.units')}</caption>
				<thead>
					<tr>
						<td />
						<th scope="col">{t('cs.side.attacker')}</th>
						<th scope="col">{t('cs.side.defender')}</th>
					</tr>
				</thead>
				<tbody>
					{ids.map((id) => (
						<tr key={id}>
							<th scope="row">{Ogame.i18n.getName(unitModel(id), lang)}</th>
							{cell('attacker', id)}
							{cell('defender', id)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function CombatResult({ error, simulation, outcome, busy, universe, universeName, onNextWave }) {
	const { t, lang } = useI18n();
	const running = simulation.status === 'running';

	const head = (
		<div className="result-head">
			<h2 className="result-title">{t('cs.result.title')}</h2>
			{outcome && <span className="result-meta">{t('cs.result.runs', { runs: outcome.runs })}</span>}
			{running && (
				<div
					className="cs-progress"
					role="progressbar"
					aria-label={t('cs.result.progress')}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(simulation.progress * 100)}
				>
					<span style={{ width: `${simulation.progress * 100}%` }} />
				</div>
			)}
		</div>
	);

	if (simulation.status === 'error' && !error) {
		return (
			<div className="result">
				{head}
				<p className="api-error" role="alert">
					{t('cs.error.engine')} <span className="api-error-detail">{simulation.error}</span>
				</p>
			</div>
		);
	}

	if (!outcome) {
		return (
			<div className="result" aria-busy={running}>
				{head}
				<p className="result-empty" role="status">
					{error
						? t(`cs.error.${error}`)
						: running
							? t('cs.result.running', { progress: Math.round(simulation.progress * 100) })
							: t('cs.result.empty')}
				</p>
			</div>
		);
	}

	const win = outcome.outcomes.attacker * 100;
	const debris = sum(outcome.debris);
	const attackerLeft = outcome.attacker.survivors.length > 0;
	const rows = [
		{ key: 'attackerLosses', resources: outcome.attacker.lostResources },
		{ key: 'defenderLosses', resources: outcome.defender.lostResources },
		{ key: 'debris', resources: outcome.debris },
		{ key: 'plunder', resources: outcome.plunder },
	];

	return (
		<div className={`result cs-result ${busy ? 'is-busy' : ''}`} aria-busy={busy}>
			{head}

			<div className="cs-verdict">
				<p className={`mb-probability ${win >= HIGH_ODDS ? 'is-high' : win < LOW_ODDS ? 'is-low' : ''}`}>
					<strong className="figure" key={win}>
						{decimal(win, lang)}%
					</strong>
					<span>{t('cs.result.win')}</span>
				</p>
				<OutcomeBar outcomes={outcome.outcomes} />
				<p className="cs-outcomes">{t('cs.result.rounds', { rounds: decimal(outcome.rounds, lang) })}</p>
			</div>

			<dl className="cs-kpis">
				<div>
					<dt>{t('cs.result.row.plunder')}</dt>
					<dd>{amount(sum(outcome.plunder))}</dd>
				</div>
				<div>
					<dt>{t('cs.result.row.debris')}</dt>
					<dd>{amount(debris)}</dd>
					{debris > 0 && <dd className="cs-kpi-note">{t('cs.result.recyclersShort', { count: groupDigits(outcome.recyclers) })}</dd>}
				</div>
				<div>
					<dt>{t('cs.result.balance')}</dt>
					<dd className={outcome.balance < 0 ? 'is-loss' : 'is-gain'}>{amount(outcome.balance)}</dd>
				</div>
				<div>
					<dt>{t('cs.result.moon')}</dt>
					<dd>{decimal(outcome.moonChance, lang)} %</dd>
				</div>
			</dl>
			<p className="help">{t('cs.result.balance.help')}</p>

			<UnitTable outcome={outcome} order={UNIT_ORDER} />

			<div className="cs-table-wrap">
				<table className="cs-table">
					<caption className="cs-subtitle">{t('cs.result.resources')}</caption>
					<thead>
						<tr>
							<td />
							{RESOURCES.map(({ key, resource }) => (
								<th scope="col" key={key} aria-label={t(`resource.${resource}`)} title={t(`resource.${resource}`)}>
									<ResourceIcon resource={resource} size={14} />
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map(({ key, resources }) => (
							<tr key={key}>
								<th scope="row">{t(`cs.result.row.${key}`)}</th>
								{RESOURCES.map(({ key: resource }) => (
									<td key={resource}>{amount(resources[resource])}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{attackerLeft && (
				<div className="cs-wave">
					<button type="button" className="btn btn-copy" onClick={onNextWave} disabled={busy}>
						{t('cs.result.nextWave')}
					</button>
					<p className="help">{t('cs.result.nextWave.help')}</p>
				</div>
			)}

			<p className="result-for">
				{universe.known
					? t('cs.result.for', {
							universe: universeName,
							debris: factor(universe.debrisFactor),
							defenseDebris: factor(universe.defenseDebrisFactor),
							repair: factor(universe.repairFactor),
						})
					: t('cs.result.forDefault', {
							debris: factor(universe.debrisFactor),
							repair: factor(universe.repairFactor),
						})}
			</p>
		</div>
	);
}

export default CombatResult;
