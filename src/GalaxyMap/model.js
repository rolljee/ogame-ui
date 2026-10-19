// Presentation model for the galaxy heatmap.
//
// The roster already carries every player's planets, so the whole map is an
// aggregation done in the browser: one pass over the roster fills a
// galaxy × system grid, and changing the metric or a status chip only re-runs
// that pass. No new route, no request per cell.
//
// All pure, so it is tested without rendering anything.

import { formatCoordinates, galaxyUrl, parseCoordinates } from '../components/galaxy';
import { filterByStatus } from '../components/status';

// What the colour of a cell counts. Planets say where the universe is crowded;
// inactives say where the farms are — the two questions people actually open a
// galaxy view for.
export const METRICS = [
	{ key: 'planets', labelKey: 'gm.metric.planets' },
	{ key: 'inactive', labelKey: 'gm.metric.inactive' },
];

// The shades, empty excluded, as fixed ranges of a system's 15 positions. Fixed
// rather than fitted to the universe: the same colour always means the same
// count, and a full system (15) gets a shade of its own so it stands out —
// that is the first thing a player looking for a slot wants to rule out.
export const HEAT_BINS = [
	{ level: 1, min: 1, max: 1 },
	{ level: 2, min: 2, max: 2 },
	{ level: 3, min: 3, max: 3 },
	{ level: 4, min: 4, max: 5 },
	{ level: 5, min: 6, max: 10 },
	{ level: 6, min: 11, max: 14 },
	{ level: 7, min: 15, max: 15 },
];

export const HEAT_LEVELS = HEAT_BINS.length;

// A player counts as a farm target once Gameforge has flagged them inactive,
// whichever of the two thresholds.
function isInactive(player) {
	return Boolean(player.status?.inactive || player.status?.longInactive);
}

// The universe size, from serverData.xml when the view has it. It may be
// missing (the request can fail on its own) and universe.xml can hold a planet
// past the announced bounds after a merge, so the data always gets the last
// word.
function gridSize({ galaxies, systems }, maxGalaxy, maxSystem) {
	return {
		galaxies: Math.max(Number(galaxies) || 0, maxGalaxy, 1),
		systems: Math.max(Number(systems) || 0, maxSystem, 1),
	};
}

function cellValue(cell, metric) {
	return metric === 'inactive' ? cell.inactive : cell.planets;
}

// Level 0 is "nothing here", so an occupied system is never painted as empty.
// Past 15 (a merge can leave odd data) still reads as full.
export function heatLevel(value) {
	if (!value || value <= 0) return 0;
	return (HEAT_BINS.find(({ max }) => value <= max) ?? HEAT_BINS[HEAT_BINS.length - 1]).level;
}

// The grid, ready to render: one row per galaxy, one cell per system.
//
// Players without coordinates are simply absent from it — universe.xml lags the
// roster by days, so anyone who registered since has no planet in it yet.
export function buildHeatmap(players, { galaxies, systems, statuses = [], metric = 'planets' } = {}) {
	const kept = filterByStatus(players, statuses);

	// Sparse while filling: a universe is 7 × 499 cells but only the occupied
	// ones are worth an object until the grid is laid out.
	const counts = new Map();
	let maxGalaxy = 0;
	let maxSystem = 0;

	for (const player of kept) {
		const inactive = isInactive(player);
		for (const planet of player.planets ?? []) {
			const parsed = parseCoordinates(planet.coords);
			if (!parsed) continue;

			maxGalaxy = Math.max(maxGalaxy, parsed.galaxy);
			maxSystem = Math.max(maxSystem, parsed.system);

			const key = `${parsed.galaxy}:${parsed.system}`;
			let cell = counts.get(key);
			if (!cell) {
				cell = { planets: 0, moons: 0, inactive: 0, players: new Set() };
				counts.set(key, cell);
			}
			cell.planets += 1;
			if (planet.moon) cell.moons += 1;
			if (inactive) cell.inactive += 1;
			cell.players.add(player.id);
		}
	}

	const size = gridSize({ galaxies, systems }, maxGalaxy, maxSystem);

	let max = 0;
	for (const cell of counts.values()) max = Math.max(max, cellValue(cell, metric));
	// Systems per shade, empty included, for the legend.
	const levels = Array(HEAT_LEVELS + 1).fill(0);

	const rows = [];
	for (let galaxy = 1; galaxy <= size.galaxies; galaxy += 1) {
		const cells = [];
		for (let system = 1; system <= size.systems; system += 1) {
			const cell = counts.get(`${galaxy}:${system}`);
			const value = cell ? cellValue(cell, metric) : 0;
			cells.push({
				galaxy,
				system,
				planets: cell?.planets ?? 0,
				moons: cell?.moons ?? 0,
				inactive: cell?.inactive ?? 0,
				players: cell?.players.size ?? 0,
				value,
				level: heatLevel(value),
			});
			levels[heatLevel(value)] += 1;
		}
		rows.push({ galaxy, cells });
	}

	return { rows, max, levels, galaxies: size.galaxies, systems: size.systems, positioned: countPositioned(kept) };
}

function countPositioned(players) {
	let planets = 0;
	for (const player of players) {
		for (const planet of player.planets ?? []) {
			if (parseCoordinates(planet.coords)) planets += 1;
		}
	}
	return planets;
}

// Ticks for the system axis. A universe has hundreds of systems and only a few
// can be labelled, so they are spaced evenly and always include the last one,
// which is what tells the reader where the map ends.
export function axisTicks(systems, step = 25) {
	const ticks = [];
	for (let system = 1; system <= systems; system += step) ticks.push(system);
	if (ticks[ticks.length - 1] !== systems) ticks.push(systems);
	return ticks;
}

// Who lives in the system a cell points at, for the panel below the map.
// Sorted by position so the list reads like the in-game galaxy view.
export function describeSystem(players, { galaxy, system, statuses = [], universe, lang } = {}) {
	const rows = [];

	for (const player of filterByStatus(players, statuses)) {
		const here = (player.planets ?? [])
			.map((planet) => ({ planet, parsed: parseCoordinates(planet.coords) }))
			.filter(({ parsed }) => parsed && parsed.galaxy === galaxy && parsed.system === system);

		for (const { planet, parsed } of here) {
			rows.push({
				id: `${player.id}:${parsed.position}`,
				player,
				position: parsed.position,
				coords: formatCoordinates(parsed),
				moon: planet.moon,
				url: universe && lang ? galaxyUrl({ universe, lang, ...parsed }) : null,
			});
		}
	}

	return rows.sort((a, b) => a.position - b.position);
}
