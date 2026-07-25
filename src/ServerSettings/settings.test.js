import { describe, it, expect } from 'vitest';
import { describeServer, formatSetting, groupDigits, tradeRatio } from './settings';

// Trimmed from the live s172-fr response.
const TUCANA = {
	name: 'Tucana',
	number: 172,
	language: 'fr',
	version: '13.0.0-r5',
	timezone: 'Europe/Paris',
	speed: 10,
	speedFleetPeaceful: 3,
	speedFleetWar: 3,
	speedFleetHolding: 3,
	researchDurationDivisor: 2,
	galaxies: 7,
	systems: 499,
	bonusFields: 30,
	donutGalaxy: 1,
	donutSystem: 1,
	debrisFactor: 0.5,
	debrisFactorDef: 0,
	deuteriumInDebris: 1,
	repairFactor: 0.7,
	defToTF: 0,
	acs: 1,
	rapidFire: 1,
	bashlimit: 6,
	topScore: 1403837599722.3,
	globalDeuteriumSaveFactor: 0.5,
	probeCargo: 0,
	cargoHyperspaceTechMultiplier: 5,
	marketplaceEnabled: 0,
	marketplaceBasicTradeRatioMetal: 2.5,
	marketplaceBasicTradeRatioCrystal: 1.5,
	marketplaceBasicTradeRatioDeuterium: 1,
};

describe('groupDigits', () => {
	it('groups thousands with dots, like the game', () => {
		expect(groupDigits(1403837599722)).toBe('1.403.837.599.722');
	});

	it('leaves short numbers alone', () => {
		expect(groupDigits(499)).toBe('499');
	});
});

describe('formatSetting', () => {
	it('marks speeds as multipliers', () => {
		expect(formatSetting(10, 'multiplier')).toBe('×10');
	});

	it('marks the research setting as a divisor', () => {
		expect(formatSetting(2, 'divisor')).toBe('÷2');
	});

	it('turns a factor into a percentage', () => {
		expect(formatSetting(0.5, 'percent')).toBe('50 %');
		expect(formatSetting(0.7, 'percent')).toBe('70 %');
	});

	it('keeps a fractional percentage readable', () => {
		expect(formatSetting(0.455, 'percent')).toBe('45.5 %');
	});

	it('does not turn a whole percentage into 100.0', () => {
		expect(formatSetting(1, 'percent')).toBe('100 %');
	});

	it('reads the hyperspace multiplier as a percentage per level', () => {
		expect(formatSetting(5, 'percentPerLevel')).toBe('5 %');
	});

	it('rounds and groups a huge score', () => {
		expect(formatSetting(1403837599722.3, 'integer')).toBe('1.403.837.599.722');
	});

	it('leaves booleans to the component, which alone can translate them', () => {
		expect(formatSetting(1, 'bool')).toBeNull();
	});
});

describe('tradeRatio', () => {
	it('assembles the three fields into one ratio', () => {
		expect(tradeRatio(TUCANA)).toBe('2.5 : 1.5 : 1');
	});

	it('returns null when the universe does not report it', () => {
		expect(tradeRatio({ marketplaceBasicTradeRatioMetal: 2.5 })).toBeNull();
	});
});

describe('describeServer', () => {
	it('returns nothing without data', () => {
		expect(describeServer(null)).toEqual([]);
	});

	it('groups the settings', () => {
		expect(describeServer(TUCANA).map((group) => group.key)).toEqual([
			'universe',
			'speed',
			'combat',
			'economy',
		]);
	});

	it('carries the raw value and its format for each row', () => {
		const speeds = describeServer(TUCANA).find((group) => group.key === 'speed');
		expect(speeds.rows).toContainEqual({
			key: 'speed',
			labelKey: 'srv.speed',
			format: 'multiplier',
			value: 10,
		});
	});

	it('exposes the assembled trade ratio as a row', () => {
		const economy = describeServer(TUCANA).find((group) => group.key === 'economy');
		expect(economy.rows.find((row) => row.key === 'tradeRatio').value).toBe('2.5 : 1.5 : 1');
	});

	it('keeps a zero, which is a real setting and not a missing one', () => {
		const combat = describeServer(TUCANA).find((group) => group.key === 'combat');
		expect(combat.rows.map((row) => row.key)).toContain('debrisFactorDef');
	});

	// A universe that reports fewer fields must not render "undefined".
	it('drops rows the universe does not report', () => {
		const groups = describeServer({ name: 'Tiny', speed: 1 });
		const keys = groups.flatMap((group) => group.rows.map((row) => row.key));
		expect(keys).toEqual(['speed']);
	});

	it('drops a group left with no row at all', () => {
		expect(describeServer({ name: 'Tiny' })).toEqual([]);
	});
});
