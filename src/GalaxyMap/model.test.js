import { describe, it, expect } from 'vitest';

import { axisTicks, buildHeatmap, describeSystem, heatLevel, HEAT_LEVELS } from './model';

const status = (over = {}) => ({
	raw: '',
	active: false,
	vacation: false,
	inactive: false,
	longInactive: false,
	banned: false,
	admin: false,
	outlaw: false,
	...over,
});

const player = (name, planets, over = {}) => ({
	id: name,
	name,
	alliance: null,
	status: status({ active: true }),
	planets: planets.map((coords) =>
		typeof coords === 'string' ? { coords, moon: false } : coords,
	),
	...over,
});

// Ada crowds 1:1 with two planets, Bo shares it, Cy is inactive elsewhere in
// galaxy 1, and Dee has no coordinates at all — universe.xml lags, so a recent
// player has none.
const ROSTER = [
	player('Ada', ['1:1:4', { coords: '1:1:8', moon: true }]),
	player('Bo', ['1:1:12']),
	player('Cy', ['1:9:3'], { status: status({ inactive: true }) }),
	player('Dee', []),
];

describe('buildHeatmap', () => {
	const cellAt = (map, galaxy, system) =>
		map.rows.find((row) => row.galaxy === galaxy).cells[system - 1];

	it('counts planets, moons and players per system', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 2, systems: 10 });
		expect(cellAt(map, 1, 1)).toMatchObject({
			planets: 3,
			moons: 1,
			players: 2,
			inactive: 0,
			value: 3,
		});
	});

	it('draws the whole universe, empty systems included', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 4, systems: 12 });
		expect(map.rows).toHaveLength(4);
		expect(map.rows[0].cells).toHaveLength(12);
		expect(cellAt(map, 3, 5)).toMatchObject({ planets: 0, value: 0, level: 0 });
	});

	it('grows past the announced size rather than dropping a planet', () => {
		const map = buildHeatmap([player('Far', ['9:600:1'])], { galaxies: 7, systems: 499 });
		expect(map.galaxies).toBe(9);
		expect(map.systems).toBe(600);
		expect(cellAt(map, 9, 600).planets).toBe(1);
	});

	it('shades a system by fixed ranges of its planets', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 1, systems: 10 });
		expect(cellAt(map, 1, 1).level).toBe(3);
		expect(cellAt(map, 1, 9).level).toBe(1);
		// Systems per shade, empty first: 8 empty, one with 1 planet, one with 3.
		expect(map.levels).toEqual([8, 1, 0, 1, 0, 0, 0, 0]);
	});

	it('counts inactive planets when asked to', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 1, systems: 10, metric: 'inactive' });
		expect(cellAt(map, 1, 1)).toMatchObject({ value: 0, level: 0 });
		expect(cellAt(map, 1, 9)).toMatchObject({ value: 1, level: 1 });
	});

	it('only counts the selected statuses', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 1, systems: 10, statuses: ['inactive'] });
		expect(cellAt(map, 1, 1).planets).toBe(0);
		expect(cellAt(map, 1, 9).planets).toBe(1);
		expect(map.positioned).toBe(1);
	});

	it('ignores players the coordinates document does not know yet', () => {
		const map = buildHeatmap(ROSTER, { galaxies: 1, systems: 10 });
		expect(map.positioned).toBe(4);
	});

	it('survives an empty roster', () => {
		const map = buildHeatmap([], { galaxies: 2, systems: 3 });
		expect(map.max).toBe(0);
		expect(map.rows.flatMap((row) => row.cells).every((cell) => cell.level === 0)).toBe(true);
	});
});

describe('heatLevel', () => {
	it('paints nothing as empty and anything as at least the first shade', () => {
		expect(heatLevel(0)).toBe(0);
		expect(heatLevel(1)).toBe(1);
	});

	it('groups the counts into the legend ranges', () => {
		expect([2, 3, 4, 5, 6, 10, 11, 14].map(heatLevel)).toEqual([2, 3, 4, 4, 5, 5, 6, 6]);
	});

	it('keeps the top shade for a full system, and past it', () => {
		expect(heatLevel(15)).toBe(HEAT_LEVELS);
		expect(heatLevel(17)).toBe(HEAT_LEVELS);
	});
});
