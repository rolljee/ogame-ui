import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';

function round(value) {
	return groupDigits(Math.round(value));
}

function ExpeditionResult({ result, universeName }) {
	const { t } = useI18n();

	if (!result.ok) {
		return (
			<div className="result">
				<h2 className="result-title">{t('exp.result.title')}</h2>
				<p className="result-empty">{t(`exp.error.${result.error}`)}</p>
			</div>
		);
	}

	const { maxFind, topScore, ships } = result;

	return (
		<div className="result">
			<h2 className="result-title">{t('exp.result.title')}</h2>

			<p className="exp-find">
				<strong>{round(maxFind)}</strong>
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

			<p className="result-for">
				{t('exp.result.top', { universe: universeName, score: groupDigits(Math.round(topScore)) })}
			</p>
		</div>
	);
}

export default ExpeditionResult;
