import { describe, it, expect } from 'vitest';
import {
	countMoons,
	describePlanets,
	describeScores,
	describeStatus,
	filterPlayers,
	formatScore,
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

describe('describeStatus', () => {
	it('badges an active player', () => {
		expect(describeStatus(status({ active: true })).map((f) => f.key)).toEqual(['active']);
	});

	// Gameforge sets both `i` and `I` past 28 days; two badges would say the
	// same thing twice.
	it('keeps only the longer inactivity', () => {
		const flags = describeStatus(status({ inactive: true, longInactive: true }));
		expect(flags.map((f) => f.key)).toEqual(['longInactive']);
	});

	it('shows every independent flag', () => {
		const flags = describeStatus(status({ vacation: true, banned: true }));
		expect(flags.map((f) => f.key)).toEqual(['vacation', 'banned']);
	});

	it('handles a missing status', () => {
		expect(describeStatus(undefined)).toEqual([]);
	});
});

describe('filterPlayers', () => {
	const players = [
		{ id: '1', name: 'Ada', status: status({ active: true }) },
		{ id: '2', name: 'Bo', status: status({ vacation: true }) },
		{ id: '3', name: 'Cy', status: status({ inactive: true, longInactive: true }) },
	];

	it('keeps everyone when nothing is selected', () => {
		expect(filterPlayers(players, [])).toHaveLength(3);
	});

	it('keeps the players matching any selected status', () => {
		expect(filterPlayers(players, ['vacation']).map((p) => p.id)).toEqual(['2']);
		expect(filterPlayers(players, ['active', 'vacation']).map((p) => p.id)).toEqual(['1', '2']);
	});

	it('counts a long inactivity as an inactivity', () => {
		expect(filterPlayers(players, ['inactive']).map((p) => p.id)).toEqual(['3']);
	});

	it('handles a missing list', () => {
		expect(filterPlayers(undefined, ['active'])).toEqual([]);
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
