import { describe, it, expect } from 'vitest';
import { computeExpedition, MAX_HYPERSPACE_LEVEL } from './formulas';

// A universe the size of s172-fr: fast economy, a top player far past the last
// tier, and the usual 5 % of extra cargo per hyperspace level.
const TUCANA = {
	name: 'Tucana',
	number: 172,
	speed: 10,
	topScore: 1403837599722,
	cargoHyperspaceTechMultiplier: 5,
};

// The tiers, the class and Pathfinder factors and the cargo bonus are tested
// in ogamejs (`Fleets.getExpeditionMaxFind`, `Fleets.getCargoCapacity`).

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

	it('scales with the economy speed', () => {
		const slow = run({ data: { ...TUCANA, speed: 1 } }).maxFind;
		expect(run().maxFind).toBe(slow * 10);
	});

	it('follows the top score tiers', () => {
		expect(run({ data: { ...TUCANA, speed: 1, topScore: 5e5 } }).maxFind).toBe(3600000);
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
