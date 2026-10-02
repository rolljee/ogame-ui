import React from 'react';
import Ogame from 'ogamejs';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import ResourceIcon from '../../components/ResourceIcon';
import { unitModel } from '../formulas';

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

function percent(share, lang) {
	return decimal(share * 100, lang);
}

function factor(value) {
	return Math.round(value * 1000) / 10;
}

function LossList({ title, losses, rebuilt = [], emptyKey }) {
	const { t, lang } = useI18n();

	return (
		<div className="cs-losses">
			<h3 className="cs-subtitle">{title}</h3>
			{losses.length === 0 ? (
				<p className="help">{t(emptyKey)}</p>
			) : (
				<ul className="cs-loss-list">
					{losses.map(({ id, count: lost }) => {
						const back = rebuilt.find((entry) => entry.id === id)?.count ?? 0;
						return (
							<li key={id}>
								<span className="cs-loss-count">{count(lost, lang)}</span>
								<span className="cs-loss-name">{Ogame.i18n.getName(unitModel(id), lang)}</span>
								{back > 0 && (
									<span className="cs-loss-rebuilt">{t('cs.result.rebuilt', { count: count(back, lang) })}</span>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

function CombatResult({ error, simulation, outcome, stale, universe, universeName }) {
	const { t, lang } = useI18n();

	const head = (
		<div className="result-head">
			<h2 className="result-title">{t('cs.result.title')}</h2>
			{outcome && <span className="result-meta">{t('cs.result.runs', { runs: outcome.runs })}</span>}
		</div>
	);

	if (simulation.status === 'running') {
		return (
			<div className="result" aria-busy="true">
				{head}
				<p className="result-empty" role="status">
					{t('cs.result.running', { progress: Math.round(simulation.progress * 100) })}
				</p>
			</div>
		);
	}

	if (simulation.status === 'error') {
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
			<div className="result">
				{head}
				<p className="result-empty">{error ? t(`cs.error.${error}`) : t('cs.result.empty')}</p>
			</div>
		);
	}

	const win = outcome.outcomes.attacker * 100;
	const rows = [
		{ key: 'attackerLosses', resources: outcome.attacker.lostResources },
		{ key: 'defenderLosses', resources: outcome.defender.lostResources },
		{ key: 'debris', resources: outcome.debris },
		{ key: 'plunder', resources: outcome.plunder },
	];

	return (
		<div className="result">
			{head}

			{stale && <p className="cs-stale">{t('cs.result.stale')}</p>}

			<p className={`mb-probability ${win >= HIGH_ODDS ? 'is-high' : win < LOW_ODDS ? 'is-low' : ''}`}>
				<strong className="figure" key={win}>
					{decimal(win, lang)}%
				</strong>
				<span>{t('cs.result.win')}</span>
			</p>

			<p className="cs-outcomes">
				{t('cs.result.outcomes', {
					defender: percent(outcome.outcomes.defender, lang),
					draw: percent(outcome.outcomes.draw, lang),
					rounds: decimal(outcome.rounds, lang),
				})}
			</p>

			<div className="cs-loss-columns">
				<LossList
					title={t('cs.result.attackerLosses')}
					losses={outcome.attacker.losses}
					emptyKey="cs.result.noLoss"
				/>
				<LossList
					title={t('cs.result.defenderLosses')}
					losses={outcome.defender.losses}
					rebuilt={outcome.defender.rebuilt}
					emptyKey="cs.result.noLoss"
				/>
			</div>

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

			<ul className="cs-facts">
				<li>
					<span>{t('cs.result.balance')}</span>
					<strong className={outcome.balance < 0 ? 'is-loss' : 'is-gain'}>{amount(outcome.balance)}</strong>
				</li>
				<li>
					<span>{t('cs.result.recyclers')}</span>
					<strong>{groupDigits(outcome.recyclers)}</strong>
				</li>
				<li>
					<span>{t('cs.result.moon')}</span>
					<strong>{decimal(outcome.moonChance, lang)} %</strong>
				</li>
			</ul>
			<p className="help">{t('cs.result.balance.help')}</p>

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
