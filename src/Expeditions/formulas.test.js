import { describe, it, expect } from 'vitest';
import {
	cargoBonus,
	computeExpedition,
	findBase,
	maxFind,
	MAX_HYPERSPACE_LEVEL,
	TOP_TIER_BASE,
} from './formulas';

// A universe the size of s172-fr: fast economy, a top player far past the last
// tier, and the usual 5 % of extra cargo per hyperspace level.
const TUCANA = {
	name: 'Tucana',
	number: 172,
	speed: 10,
	topScore: 1403837599722,
	cargoHyperspaceTechMultiplier: 5,
};

describe('findBase', () => {
	it('grows with the top score, by tier', () => {
		expect(findBase(0)).toBe(40000);
		expect(findBase(9999)).toBe(40000);
		expect(findBase(10000)).toBe(500000);
		expect(findBase(999999)).toBe(1200000);
		expect(findBase(4999999)).toBe(1800000);
		expect(findBase(99999999)).toBe(4200000);
	});

	it('caps at the top tier once the score passes 100 M', () => {
		expect(findBase(100e6)).toBe(TOP_TIER_BASE);
		expect(findBase(1403837599722)).toBe(TOP_TIER_BASE);
	});
});

describe('maxFind', () => {
	it('scales with the economy speed', () => {
		expect(maxFind({ speed: 1, topScore: 200e6, pathfinder: false })).toBe(7500000);
		expect(maxFind({ speed: 10, topScore: 200e6, pathfinder: false })).toBe(75000000);
	});

	it('doubles with a Pathfinder in the fleet', () => {
		const without = maxFind({ speed: 8, topScore: 5e6, pathfinder: false });
		expect(maxFind({ speed: 8, topScore: 5e6, pathfinder: true })).toBe(without * 2);
	});
});

describe('cargoBonus', () => {
	it('is the level times the server multiplier, as a ratio', () => {
		expect(cargoBonus({ hyperspaceLevel: 0, hyperspaceMultiplier: 5 })).toBe(0);
		expect(cargoBonus({ hyperspaceLevel: 10, hyperspaceMultiplier: 5 })).toBe(0.5);
		expect(cargoBonus({ hyperspaceLevel: 20, hyperspaceMultiplier: 5 })).toBe(1);
	});
});

describe('computeExpedition', () => {
	const run = (over) =>
		computeExpedition({ data: TUCANA, hyperspaceLevel: '10', pathfinder: true, ...over });

	// Numeric parity with `!oge 172 fr 10` on the Discord bot.
	it('matches the bot on a real universe', () => {
		const result = run();
		expect(result.maxFind).toBe(150000000);
		expect(result.ships).toEqual([
			{ key: 'largeCargo', capacity: 37500, count: 4000 },
			{ key: 'smallCargo', capacity: 7500, count: 20000 },
		]);
	});

	it('needs fewer ships as hyperspace goes up', () => {
		const low = run({ hyperspaceLevel: '5' }).ships[0].count;
		const high = run({ hyperspaceLevel: '20' }).ships[0].count;
		expect(high).toBeLessThan(low);
	});

	it('halves the find without a Pathfinder', () => {
		expect(run({ pathfinder: false }).maxFind).toBe(75000000);
	});

	it('rounds ship counts up: a partial load still needs a whole ship', () => {
		const result = computeExpedition({
			data: { ...TUCANA, speed: 1, topScore: 5000 },
			hyperspaceLevel: '0',
			pathfinder: false,
		});
		// 60 000 units over 25 000 per Large Cargo.
		expect(result.maxFind).toBe(60000);
		expect(result.ships[0].count).toBe(3);
	});

	it('waits for a universe', () => {
		expect(computeExpedition({ data: null, hyperspaceLevel: '10' })).toEqual({
			ok: false,
			error: 'universe',
		});
	});

	it('rejects a universe missing the fields it needs', () => {
		const data = { ...TUCANA, cargoHyperspaceTechMultiplier: undefined };
		expect(computeExpedition({ data, hyperspaceLevel: '10' }).error).toBe('data');
	});

	it('rejects an empty or out-of-range hyperspace level', () => {
		expect(run({ hyperspaceLevel: '' }).error).toBe('level');
		expect(run({ hyperspaceLevel: String(MAX_HYPERSPACE_LEVEL + 1) }).error).toBe('level');
	});

	it('accepts level 0', () => {
		expect(run({ hyperspaceLevel: '0' }).ok).toBe(true);
	});
});
