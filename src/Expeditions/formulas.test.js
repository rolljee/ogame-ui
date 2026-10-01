import { describe, it, expect } from 'vitest';
import { computeExpedition, parsePercent, MAX_HYPERSPACE_LEVEL } from './formulas';

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

describe('parsePercent', () => {
	it('reads an empty field as no bonus', () => {
		expect(parsePercent('')).toBe(0);
		expect(parsePercent(undefined)).toBe(0);
	});

	it('turns a percentage into a fraction, with a comma or a dot', () => {
		expect(parsePercent('20')).toBe(0.2);
		expect(parsePercent('12,5')).toBe(0.125);
		expect(parsePercent('12.5')).toBe(0.125);
	});

	it('rejects what cannot be a percentage', () => {
		expect(parsePercent('abc')).toBeNull();
		expect(parsePercent('1,2,3')).toBeNull();
		expect(parsePercent('-5')).toBeNull();
	});
});

describe('computeExpedition with a class and lifeform bonuses', () => {
	const run = (over) =>
		computeExpedition({ data: TUCANA, hyperspaceLevel: '10', pathfinder: true, ...over });

	it('defaults to a Discoverer without lifeform bonus, the historic figure', () => {
		expect(run().maxFind).toBe(run({ characterClass: 'explorer', bonuses: {} }).maxFind);
		expect(run().characterClass).toBe('explorer');
	});

	it('leaves the economy speed out for another class', () => {
		expect(run({ characterClass: 'general' }).maxFind).toBe(10000000);
		expect(run({ characterClass: 'collector' }).maxFind).toBe(10000000);
	});

	it('reads the class bonuses from the universe', () => {
		const data = {
			...TUCANA,
			explorerBonusIncreasedExpeditionOutcome: 1,
			minerBonusIncreasedCargoCapacityForTradingShips: 0.5,
		};
		expect(run({ data }).maxFind).toBe(5000000 * 2 * 10 * 2);
		expect(run({ data, characterClass: 'collector' }).ships[0].capacity).toBe(50000);
	});

	it('gives the Collector cargo bonus to the cargo ships only for a Collector', () => {
		expect(run({ characterClass: 'collector' }).ships[0].capacity).toBe(43750);
		expect(run({ characterClass: 'general' }).ships[0].capacity).toBe(37500);
	});

	it('amplifies the Discoverer bonus, and only for a Discoverer', () => {
		expect(run({ bonuses: { explorer: '20' } }).maxFind).toBeCloseTo(160000000, 6);
		expect(run({ characterClass: 'general', bonuses: { explorer: '20' } }).maxFind).toBe(10000000);
	});

	it('multiplies the find with the resource bonus, for every class', () => {
		expect(run({ bonuses: { resources: '10' } }).maxFind).toBeCloseTo(165000000, 6);
		expect(run({ characterClass: 'general', bonuses: { resources: '10' } }).maxFind).toBeCloseTo(11000000, 6);
	});

	it('adds the lifeform cargo bonus to the other cargo bonuses', () => {
		// 25 000 × (1 + 50 % hyperspace + 25 % Collector + 10 % lifeform)
		expect(run({ characterClass: 'collector', bonuses: { cargo: '10' } }).ships[0].capacity).toBeCloseTo(46250, 6);
	});

	it('lists the informative bonuses the player has, without changing the figures', () => {
		const result = run({ bonuses: { darkMatter: '3,5', fleetLoss: '12' } });
		expect(result.info).toEqual([
			{ key: 'darkMatter', value: 0.035 },
			{ key: 'fleetLoss', value: 0.12 },
		]);
		expect(result.maxFind).toBe(150000000);
	});

	it('names the field that is not a percentage', () => {
		expect(run({ bonuses: { cargo: 'x' } })).toEqual({ ok: false, error: 'bonus', field: 'cargo' });
	});
});
