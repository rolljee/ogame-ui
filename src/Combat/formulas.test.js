import { describe, it, expect } from 'vitest';
import {
	buildBattle,
	describeOutcome,
	parseCount,
	readUniverse,
	runBattles,
	summariseBattles,
} from './formulas';

const SIDE = { techs: {}, ships: {}, defenses: {} };

function battle(overrides = {}) {
	return buildBattle({
		attacker: { ...SIDE, ships: { 8: '10' } },
		defender: { ...SIDE, defenses: { 201: '500' } },
		resources: {},
		hyperspaceLevel: '',
		plunderRatio: 0.5,
		runs: 5,
		data: null,
		...overrides,
	});
}

describe('parseCount', () => {
	it('reads digits, dots and spaces as thousands, empty as 0', () => {
		expect(parseCount('')).toBe(0);
		expect(parseCount('1.500')).toBe(1500);
		expect(parseCount('2 000')).toBe(2000);
		expect(parseCount('12a')).toBeNull();
	});
});

describe('readUniverse', () => {
	it('falls back to the usual settings without a universe', () => {
		expect(readUniverse(null)).toEqual({
			known: false,
			debrisFactor: 0.3,
			defenseDebrisFactor: 0,
			deuteriumDebrisFactor: 0,
			repairFactor: 0.7,
			hyperspaceMultiplier: 5,
		});
	});

	it('reads the universe debris, repair and cargo settings', () => {
		expect(
			readUniverse({
				debrisFactor: '0.7',
				debrisFactorDef: '0.5',
				deuteriumInDebris: '1',
				repairFactor: '0.6',
				cargoHyperspaceTechMultiplier: '2',
			}),
		).toEqual({
			known: true,
			debrisFactor: 0.7,
			defenseDebrisFactor: 0.5,
			deuteriumDebrisFactor: 0.7,
			repairFactor: 0.6,
			hyperspaceMultiplier: 2,
		});
	});
});

describe('buildBattle', () => {
	it('keeps only the units that were typed, as library ids', () => {
		const built = battle({
			attacker: { techs: { weapons: '18' }, ships: { 8: '10', 1: '' } },
		});
		expect(built.ok).toBe(true);
		expect(built.battle.attacker).toEqual({
			fleet: [{ id: 8, count: 10 }],
			techs: { weapons: 18, shielding: 0, armour: 0 },
		});
		expect(built.battle.defender.fleet).toEqual([{ id: 201, count: 500 }]);
	});

	it('passes the universe settings and the loot to the engine', () => {
		const built = battle({
			resources: { metal: '100000', crystal: '', deuterium: '50' },
			hyperspaceLevel: '12',
			data: { debrisFactor: '0.5', repairFactor: '0.7' },
		});
		expect(built.battle.options).toMatchObject({
			debrisFactor: 0.5,
			repairFactor: 0.7,
			plunder: {
				resources: { metal: 100000, crystal: 0, deuterium: 50 },
				ratio: 0.5,
				hyperspaceLevel: 12,
			},
		});
	});

	it('explains what is missing', () => {
		expect(battle({ attacker: SIDE }).error).toBe('attacker');
		expect(battle({ defender: SIDE }).error).toBe('defender');
		expect(battle({ attacker: { ...SIDE, techs: { armour: '41' }, ships: { 8: '1' } } }).error).toBe('tech');
		expect(battle({ hyperspaceLevel: '99' }).error).toBe('tech');
	});
});

describe('a simulated battle', () => {
	it('averages the runs and prices the outcome', () => {
		const { battle: plain } = battle({ resources: { metal: '1000000' } });
		const stats = summariseBattles(runBattles(plain, 1, 0, plain.runs));
		const outcome = describeOutcome(stats);

		expect(outcome.runs).toBe(5);
		expect(outcome.outcomes.attacker).toBe(1);
		expect(outcome.defender.losses).toEqual([{ id: 201, count: 500 }]);
		expect(outcome.defender.rebuilt[0].id).toBe(201);
		// Rocket launchers leave no debris on most universes, and deathstars lose nothing.
		expect(outcome.debris).toEqual({ metal: 0, crystal: 0, deuterium: 0 });
		expect(outcome.recyclers).toBe(0);
		expect(outcome.plunder.metal).toBe(500000);
		expect(outcome.balance).toBe(500000);
	});

	it('is reproducible for a given seed', () => {
		const { battle: plain } = battle({ attacker: { ...SIDE, ships: { 1: '300' } } });
		expect(runBattles(plain, 7, 0, 3)).toEqual(runBattles(plain, 7, 0, 3));
	});
});
