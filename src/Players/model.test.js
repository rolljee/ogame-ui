import { describe, it, expect } from 'vitest';
import { countMoons, describePlanets, describeScores, formatScore } from './model';

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
