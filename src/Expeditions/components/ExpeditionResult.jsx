import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';

function round(value) {
	return groupDigits(Math.round(value));
}

function percent(fraction) {
	// Up to two decimals, as the in-game bonus page prints them.
	return String(Math.round(fraction * 10000) / 100);
}

function ExpeditionResult({ result, universeName }) {
	const { t } = useI18n();

	if (!result.ok) {
		return (
			<div className="result">
				<div className="result-head">
					<h2 className="result-title">{t('exp.result.title')}</h2>
				</div>
				<p className="result-empty">
					{result.error === 'bonus'
						? t('exp.error.bonus', { field: t(`exp.lf.${result.field}`) })
						: t(`exp.error.${result.error}`)}
				</p>
			</div>
		);
	}

	const { maxFind, topScore, ships, characterClass, lifeform, info } = result;
	const applied = [
		t(`exp.class.${characterClass}`),
		...(characterClass === 'explorer' && lifeform.explorer > 0
			? [t('exp.applied.explorer', { value: percent(lifeform.explorer) })]
			: []),
		...(lifeform.resources > 0 ? [t('exp.applied.resources', { value: percent(lifeform.resources) })] : []),
		...(lifeform.cargo > 0 ? [t('exp.applied.cargo', { value: percent(lifeform.cargo) })] : []),
	];

	return (
		<div className="result">
			<div className="result-head">
				<h2 className="result-title">{t('exp.result.title')}</h2>
			</div>

			<p className="exp-find">
				<strong className="figure" key={maxFind}>
					{round(maxFind)}
				</strong>
				<span>{t('exp.result.find')}</span>
			</p>

			<ul className="exp-ships">
				{ships.map(({ key, count, capacity }) => (
					<li key={key}>
						<span className="exp-ship-count">{groupDigits(count)}</span>
						<span className="exp-ship-name">{t(`exp.ship.${key}`)}</span>
						<span className="exp-ship-capacity">
							{t('exp.result.capacity', { capacity: round(capacity) })}
						</span>
					</li>
				))}
			</ul>

			<p className="exp-applied">{t('exp.applied', { list: applied.join(' · ') })}</p>

			{info.length > 0 && (
				<div className="exp-info">
					<h3 className="exp-info-title">{t('exp.info.title')}</h3>
					<ul>
						{info.map(({ key, value }) => (
							<li key={key}>{t(`exp.info.${key}`, { value: percent(value) })}</li>
						))}
					</ul>
				</div>
			)}

			<p className="result-for">
				{t('exp.result.top', { universe: universeName, score: groupDigits(Math.round(topScore)) })}
			</p>
		</div>
	);
}

export default ExpeditionResult;
