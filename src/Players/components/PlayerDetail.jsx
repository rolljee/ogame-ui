import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { groupDigits } from '../../components/format';
import { countMoons, describePlanets, describeScores, formatScore } from '../model';

function Coordinates({ coords, url }) {
	if (!url) return <span className="pl-coords">[{coords}]</span>;
	return (
		<a className="pl-coords" href={url} target="_blank" rel="noopener noreferrer">
			[{coords}]
		</a>
	);
}

function PlayerDetail({ player, selection }) {
	const { t } = useI18n();

	const scores = describeScores(player.scores);
	const planets = describePlanets(player, {
		universe: selection.universe,
		lang: selection.lang,
	});

	return (
		<div className="result">
			<h2 className="result-title">{t('pl.detail.title')}</h2>
			<h3 className="pl-name">{player.name}</h3>
			<p className="srv-subtitle">
				{t('pl.detail.summary', {
					planets: planets.length,
					moons: countMoons(planets),
				})}
			</p>

			<section className="srv-group">
				<h3 className="srv-group-title">{t('pl.detail.scores')}</h3>
				<dl className="srv-rows">
					{scores.map((score) => (
						<div className="srv-row" key={score.key}>
							<dt>{t(score.labelKey)}</dt>
							<dd>
								{formatScore(score.score)}
								{score.rank !== null && score.rank !== undefined && (
									<span className="pl-rank"> · #{groupDigits(score.rank)}</span>
								)}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="srv-group">
				<h3 className="srv-group-title">{t('pl.detail.planets')}</h3>
				<ul className="pl-planets">
					{planets.map((planet) => (
						<li key={planet.id}>
							<Coordinates coords={planet.coords} url={planet.url} />
							<span className="pl-planet-name">{planet.name}</span>
							{planet.moon && (
								<span className="pl-moon">
									<span aria-hidden="true">🌑</span> {planet.moon.name}
									{planet.moon.size ? ` · ${groupDigits(planet.moon.size)} km` : ''}
								</span>
							)}
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

export default PlayerDetail;
