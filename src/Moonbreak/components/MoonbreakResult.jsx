import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { WAVES_PER_ATTACKER } from '../formulas';

// Turn a wave split into a translatable sentence. Below 6 Deathstars there is
// no full wave to describe, only the leftover single-ship waves.
function waveSentence(t, { base, remainder }) {
	if (remainder === 0) {
		return t('mb.waves.uniform', { waves: WAVES_PER_ATTACKER, rip: base });
	}
	if (base === 0) {
		return t('mb.waves.partial', { waves: remainder });
	}
	return t('mb.waves.mixed', {
		wavesA: remainder,
		ripA: base + 1,
		wavesB: WAVES_PER_ATTACKER - remainder,
		ripB: base,
	});
}

function MoonbreakResult({ result }) {
	const { t } = useI18n();

	if (!result.ok) {
		return (
			<div className="result">
				<h2 className="result-title">{t('mb.result.title')}</h2>
				<p className="result-empty">{t(`mb.error.${result.errors[0]}`)}</p>
			</div>
		);
	}

	const { probability, totalRip, attackers, losses } = result;

	return (
		<div className="result">
			<h2 className="result-title">{t('mb.result.title')}</h2>

			<p className="mb-probability">
				<strong>{probability}%</strong>
				<span>{t('mb.result.probability')}</span>
			</p>

			<ul className="mb-waves">
				{attackers.map((attacker, index) => (
					// Positional, like the input rows above.
					<li key={index}>
						{attackers.length > 1 && (
							<span className="mb-waves-who">
								{t('mb.attacker', { n: index + 1 })} · {attacker.rip} RIP
							</span>
						)}
						<span className="mb-waves-plan">{waveSentence(t, attacker)}</span>
					</li>
				))}
			</ul>

			<h3 className="mb-losses-title">{t('mb.result.losses')}</h3>
			<ul className="mb-bands">
				{losses.bands.map(({ confidence, min, max }) => (
					<li key={confidence}>
						<span className="mb-band-confidence">{confidence}%</span>
						<span>{t('mb.result.band', { min, max })}</span>
					</li>
				))}
			</ul>

			<p className="result-for">
				{t('mb.result.mean')} <strong>{losses.mean}</strong> / {totalRip} RIP
			</p>
		</div>
	);
}

export default MoonbreakResult;
