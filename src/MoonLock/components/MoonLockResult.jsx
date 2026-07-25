import React from 'react';
import Ogame from 'ogamejs';

import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import CopyButton from '../../components/CopyButton';
import { formatCoordinates, MAX_MOON_CHANCE, MOON_DEBRIS_THRESHOLD } from '../formulas';

function MoonLockResult({ result }) {
	const { t, lang } = useI18n();

	if (!result.ok) {
		return (
			<div className="result">
				<h2 className="result-title">{t('ml.result.title')}</h2>
				<p className="result-empty">{t(`ml.error.${result.error}`)}</p>
			</div>
		);
	}

	const { coordinates, debrisFactor, ships, url } = result;

	return (
		<div className="result">
			<h2 className="result-title">{t('ml.result.title')}</h2>

			<p className="ml-link">
				<a href={url} target="_blank" rel="noopener noreferrer">
					{formatCoordinates(coordinates)}
				</a>
				<span>
					{t('ml.result.debris', { percent: Math.round(debrisFactor * 1000) / 10 })}
				</span>
			</p>

			<ul className="ml-ships">
				{ships.map(({ id, model, count }) => (
					<li key={id}>
						<span className="ml-ship-count">{groupDigits(count)}</span>
						<span className="ml-ship-name">{Ogame.i18n.getName(model, lang)}</span>
					</li>
				))}
			</ul>

			<p className="result-for">
				{t('ml.result.threshold', {
					debris: groupDigits(MOON_DEBRIS_THRESHOLD),
					chance: MAX_MOON_CHANCE,
				})}
			</p>

			<div className="ml-actions">
				<CopyButton text={url} labelKey="ml.result.copy" />
			</div>
		</div>
	);
}

export default MoonLockResult;
