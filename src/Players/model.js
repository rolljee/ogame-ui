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
import { matchesSearch } from '../components/search';
import { filterByStatus } from '../components/status';

// --- The roster: filtering and sorting, in the browser ----------------------
//
// The whole universe arrives in one document, so none of this costs a request:
// a keystroke, a galaxy or a status chip re-filters a list already in memory.

// A player is in a galaxy or a system if any of their planets is. Coordinates
// come from universe.xml, which lags by days, so a player who registered since
// has none and cannot match a position filter — they are only dropped when such
// a filter is actually set.
function inPosition(player, { galaxy, system }) {
	if (!galaxy && !system) return true;
	return player.planets.some((planet) => {
		const parsed = parseCoordinates(planet.coords);
		if (!parsed) return false;
		return (
			(!galaxy || parsed.galaxy === Number(galaxy)) &&
			(!system || parsed.system === Number(system))
		);
	});
}

export function filterRoster(players, { query = '', galaxy = '', system = '', statuses = [] } = {}) {
	if (!players) return [];
	return filterByStatus(players, statuses).filter(
		(player) =>
			(query === '' || matchesSearch(player.name, query)) &&
			inPosition(player, { galaxy, system }),
	);
}

// Sortable on the two things the roster knows about everyone. A player without
// coordinates has no position to sort on and goes last, whichever way.
export const SORTS = [
	{ key: 'name', labelKey: 'pl.sort.name' },
	{ key: 'position', labelKey: 'pl.sort.position' },
];

function positionKey(player) {
	// Planets arrive sorted, so the first one is the player's lowest position.
	const parsed = parseCoordinates(player.planets[0]?.coords ?? '');
	if (!parsed) return Number.MAX_SAFE_INTEGER;
	return parsed.galaxy * 1e6 + parsed.system * 1e3 + parsed.position;
}

export function sortRoster(players, sort) {
	const sorted = [...players];
	if (sort === 'position') {
		return sorted.sort((a, b) => positionKey(a) - positionKey(b) || a.name.localeCompare(b.name));
	}
	return sorted.sort((a, b) => a.name.localeCompare(b.name));
}

// Coordinates to show on a roster row: the ones that matched the position
// filter, since that is what the eye is looking for, or else the player's first
// few. `rest` is what the cap left out.
export const COORDS_PER_ROW = 3;

export function describeRosterCoords(player, { universe, lang, galaxy = '', system = '' } = {}) {
	const positioned = (galaxy || system)
		? player.planets.filter((planet) => inPosition({ planets: [planet] }, { galaxy, system }))
		: player.planets;

	return {
		coords: positioned.slice(0, COORDS_PER_ROW).map((planet) => {
			const parsed = parseCoordinates(planet.coords);
			return {
				coords: parsed ? formatCoordinates(parsed) : String(planet.coords),
				moon: planet.moon,
				url: parsed && universe && lang ? galaxyUrl({ universe, lang, ...parsed }) : null,
			};
		}),
		rest: Math.max(positioned.length - COORDS_PER_ROW, 0),
	};
}

// universe.xml is regenerated every few days, so the view says how old the
// coordinates are rather than implying they are live.
export function coordsAge(coordsTimestamp, now = Date.now()) {
	if (!coordsTimestamp) return null;
	return Math.max(Math.round((now / 1000 - coordsTimestamp) / 3600), 0);
}

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
