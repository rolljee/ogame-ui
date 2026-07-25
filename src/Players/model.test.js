import { describe, it, expect } from 'vitest';
import {
	COORDS_PER_ROW,
	coordsAge,
	countMoons,
	describePlanets,
	describeRosterCoords,
	describeScores,
	filterRoster,
	formatScore,
	sortRoster,
} from './model';

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

const rosterPlayer = (name, coords, over = {}) => ({
	id: name,
	name,
	alliance: null,
	status: status({ active: true }),
	planets: coords.map((c) => ({ coords: c, moon: false })),
	...over,
});

// Ada is spread over two galaxies, Bo shares Ada's system, Cy is elsewhere, and
// Dee has no coordinates at all — universe.xml lags, so recent players have none.
const ROSTER = [
	rosterPlayer('Ada', ['1:1:1', '4:212:8']),
	rosterPlayer('Bo', ['4:212:9']),
	rosterPlayer('Cy', ['2:194:8'], { status: status({ vacation: true }) }),
	rosterPlayer('Dee', []),
];

describe('filterRoster', () => {
	const names = (result) => result.map((player) => player.name);

	it('keeps everyone when nothing is filtered', () => {
		expect(names(filterRoster(ROSTER))).toEqual(['Ada', 'Bo', 'Cy', 'Dee']);
	});

	it('filters by name, ignoring case and accents', () => {
		expect(names(filterRoster(ROSTER, { query: 'ad' }))).toEqual(['Ada']);
		expect(names(filterRoster([rosterPlayer('Élysée', [])], { query: 'elysee' }))).toHaveLength(1);
	});

	it('filters by galaxy', () => {
		expect(names(filterRoster(ROSTER, { galaxy: '4' }))).toEqual(['Ada', 'Bo']);
	});

	it('filters by system', () => {
		expect(names(filterRoster(ROSTER, { system: '212' }))).toEqual(['Ada', 'Bo']);
	});

	it('combines galaxy and system', () => {
		expect(names(filterRoster(ROSTER, { galaxy: '2', system: '212' }))).toEqual([]);
		expect(names(filterRoster(ROSTER, { galaxy: '4', system: '212' }))).toEqual(['Ada', 'Bo']);
	});

	it('combines a position with a status and a name', () => {
		expect(names(filterRoster(ROSTER, { galaxy: '4', statuses: ['active'] }))).toEqual(['Ada', 'Bo']);
		expect(names(filterRoster(ROSTER, { galaxy: '4', query: 'bo' }))).toEqual(['Bo']);
		expect(names(filterRoster(ROSTER, { statuses: ['vacation'] }))).toEqual(['Cy']);
	});

	// A player without coordinates cannot be in a galaxy, but must not vanish
	// from an unfiltered list either.
	it('drops a player without coordinates only when a position is asked for', () => {
		expect(names(filterRoster(ROSTER, { galaxy: '1' }))).not.toContain('Dee');
		expect(names(filterRoster(ROSTER, { query: 'dee' }))).toEqual(['Dee']);
	});

	it('handles a roster that has not loaded yet', () => {
		expect(filterRoster(undefined, { galaxy: '4' })).toEqual([]);
	});
});

describe('sortRoster', () => {
	const names = (result) => result.map((player) => player.name);

	it('sorts by name by default', () => {
		expect(names(sortRoster([...ROSTER].reverse(), 'name'))).toEqual(['Ada', 'Bo', 'Cy', 'Dee']);
	});

	it('sorts by position, galaxy then system then slot', () => {
		expect(names(sortRoster(ROSTER, 'position'))).toEqual(['Ada', 'Cy', 'Bo', 'Dee']);
	});

	it('leaves a player without coordinates last', () => {
		expect(names(sortRoster(ROSTER, 'position')).at(-1)).toBe('Dee');
	});

	it('does not mutate the list it is given', () => {
		const original = [...ROSTER];
		sortRoster(ROSTER, 'position');
		expect(ROSTER).toEqual(original);
	});
});

describe('describeRosterCoords', () => {
	const selection = { universe: '282', lang: 'fr' };

	it('links each coordinate into the galaxy view', () => {
		const { coords } = describeRosterCoords(ROSTER[0], selection);
		expect(coords[0].coords).toBe('1:1:1');
		expect(coords[0].url).toContain('galaxy=1&system=1&position=1');
	});

	// The eye is looking for what matched, not for the player's whole empire.
	it('shows the coordinates that matched the position filter', () => {
		const { coords } = describeRosterCoords(ROSTER[0], { ...selection, galaxy: '4' });
		expect(coords.map((c) => c.coords)).toEqual(['4:212:8']);
	});

	it('caps the list and reports what it left out', () => {
		const many = rosterPlayer('Big', ['1:1:1', '1:1:2', '1:1:3', '1:1:4', '1:1:5']);
		const { coords, rest } = describeRosterCoords(many, selection);
		expect(coords).toHaveLength(COORDS_PER_ROW);
		expect(rest).toBe(5 - COORDS_PER_ROW);
	});

	it('says nothing rather than guess for a player without coordinates', () => {
		expect(describeRosterCoords(ROSTER[3], selection)).toEqual({ coords: [], rest: 0 });
	});

	it('keeps an unparsable coordinate visible, without a link', () => {
		const odd = { ...rosterPlayer('Odd', []), planets: [{ coords: 'nope', moon: false }] };
		const { coords } = describeRosterCoords(odd, selection);
		expect(coords[0]).toMatchObject({ coords: 'nope', url: null });
	});

	it('flags a moon', () => {
		const withMoon = { ...rosterPlayer('Moony', []), planets: [{ coords: '1:1:1', moon: true }] };
		expect(describeRosterCoords(withMoon, selection).coords[0].moon).toBe(true);
	});
});

describe('coordsAge', () => {
	it('counts the hours since the galaxy dump was generated', () => {
		const now = 1_784_000_000_000;
		expect(coordsAge(now / 1000 - 7200, now)).toBe(2);
	});

	it('never reports a negative age when the clocks disagree', () => {
		const now = 1_784_000_000_000;
		expect(coordsAge(now / 1000 + 600, now)).toBe(0);
	});

	it('handles a universe without a dump timestamp', () => {
		expect(coordsAge(null)).toBeNull();
	});
});

describe('describeScores', () => {
	it('orders the documented categories and drops the rest', () => {
		const scores = [
			{ type: 7, key: 'honour', score: 12, rank: 3 },
			{ type: 0, key: 'total', score: 1000, rank: 1 },
			{ type: 9, key: null, score: 5, rank: 2 },
		];
		expect(describeScores(scores).map((row) => row.key)).toEqual(['total', 'honour']);
	});

	it('drops the categories the universe does not report', () => {
		expect(describeScores([{ type: 0, key: 'total', score: 1, rank: 1 }])).toHaveLength(1);
	});
});

describe('formatScore', () => {
	it('groups digits and rounds', () => {
		expect(formatScore(1403837.6)).toBe('1.403.838');
	});

	it('shows a dash when there is no score', () => {
		expect(formatScore(null)).toBe('—');
	});
});

describe('describePlanets', () => {
	const player = {
		planets: [
			{ id: '1', name: 'Colonie', coords: '4:212:8', moon: { id: '9', name: 'Lune', size: 8944 } },
			{ id: '2', name: 'Mère', coords: '1:1:1', moon: null },
		],
	};

	it('links every coordinate into the galaxy view', () => {
		const [first] = describePlanets(player, { universe: '172', lang: 'fr' });
		expect(first.coords).toBe('4:212:8');
		expect(first.url).toContain('s172-fr.ogame.gameforge.com');
		expect(first.url).toContain('galaxy=4&system=212&position=8');
	});

	it('still shows coordinates it cannot parse, without a link', () => {
		const odd = { planets: [{ id: '3', name: 'Odd', coords: 'nowhere', moon: null }] };
		const [planet] = describePlanets(odd, { universe: '172', lang: 'fr' });
		expect(planet.coords).toBe('nowhere');
		expect(planet.url).toBeNull();
	});

	it('handles a player that has not loaded yet', () => {
		expect(describePlanets(null, { universe: '172', lang: 'fr' })).toEqual([]);
	});
});

describe('countMoons', () => {
	it('counts only the planets carrying a moon', () => {
		expect(countMoons([{ moon: {} }, { moon: null }, { moon: {} }])).toBe(2);
	});
});
