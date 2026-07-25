// Presentation model for the players view.
//
// The proxy already decodes the packed status attribute into booleans and names
// the documented score categories; what is left is deciding what to show, in
// which order, and how to filter it. All pure, so it is tested without
// rendering anything.
//
// The status flags themselves live in `../components/status`: the alliance view
// shows the same badges on its members.

import { groupDigits } from '../components/format';
import { formatCoordinates, galaxyUrl, parseCoordinates } from '../components/galaxy';

// The categories worth a row, in the order the game shows them. Types 8 to 21
// are undocumented and arrive with `key: null`; they are dropped rather than
// labelled with a guess.
export const SCORE_ROWS = [
	{ key: 'total', labelKey: 'pl.score.total' },
	{ key: 'economy', labelKey: 'pl.score.economy' },
	{ key: 'research', labelKey: 'pl.score.research' },
	{ key: 'military', labelKey: 'pl.score.military' },
	{ key: 'militaryBuilt', labelKey: 'pl.score.militaryBuilt' },
	{ key: 'militaryDestroyed', labelKey: 'pl.score.militaryDestroyed' },
	{ key: 'militaryLost', labelKey: 'pl.score.militaryLost' },
	{ key: 'honour', labelKey: 'pl.score.honour' },
];

export function describeScores(scores) {
	if (!scores) return [];
	return SCORE_ROWS.map((row) => {
		const entry = scores.find((score) => score.key === row.key);
		return entry ? { ...row, ...entry } : null;
	}).filter(Boolean);
}

export function formatScore(value) {
	return value === null || value === undefined ? '—' : groupDigits(Math.round(value));
}

// A planet row ready to render: its coordinates, the link into the galaxy view,
// and the moon when there is one. An unparsable `coords` still shows the raw
// string, only without a link.
export function describePlanets(player, { universe, lang }) {
	if (!player?.planets) return [];

	return player.planets.map((planet) => {
		const parsed = parseCoordinates(planet.coords);
		return {
			...planet,
			coords: parsed ? formatCoordinates(parsed) : String(planet.coords),
			url: parsed && universe && lang ? galaxyUrl({ universe, lang, ...parsed }) : null,
		};
	});
}

export function countMoons(planets) {
	return planets.filter((planet) => planet.moon).length;
}
