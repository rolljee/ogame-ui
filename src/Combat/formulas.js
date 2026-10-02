// Combat simulator. The battle engine and the averaging come from ogamejs
// (`Fleets.simulateCombat`, `Fleets.getCombatStatistics`); this file only reads
// the form and the universe settings, and turns the averaged outcome into what
// the report shows.
//
// A battle is random, so the report is an average over many simulated runs.
// They are run in a Web Worker (see `useCombatSimulation.js`), which is why the
// form is turned into plain library ids here: a worker only receives data.

import Ogame from 'ogamejs';

const { Destroyable } = Ogame.models;
const { getCombatStatistics } = Ogame.Fleets;

export const MAX_TECH_LEVEL = 40;

// How many battles to average. More runs, steadier figures, longer wait.
export const RUN_CHOICES = [20, 100, 500];
export const DEFAULT_RUNS = 100;

// The share of the planet's resources a winner can carry away: 50 % on most
// targets, more against inactive players on some universes.
export const PLUNDER_CHOICES = [0.5, 0.75, 1];
export const DEFAULT_PLUNDER_RATIO = 0.5;

// The defaults ogamejs uses when a universe does not say otherwise.
const DEFAULT_DEBRIS_FACTOR = 0.3;
const DEFAULT_REPAIR_FACTOR = 0.7;
const DEFAULT_HYPERSPACE_MULTIPLIER = 5;

// Library ids, in the order of the in-game shipyard and defense pages. Solar
// satellites and crawlers never leave the planet, so only the defender has them.
export const ATTACKER_SHIPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const DEFENDER_SHIPS = [...ATTACKER_SHIPS, 16, 17];
export const DEFENSES = [201, 202, 203, 204, 205, 206, 207, 208];

export const TECHS = ['weapons', 'shielding', 'armour'];
export const RESOURCE_KEYS = ['metal', 'crystal', 'deuterium'];

// The recycler is what collects the debris field.
const RECYCLER_ID = 14;

export function unitModel(id) {
	return Destroyable[id];
}

// A count or a level as typed: digits only, empty is 0.
// Returns null when the text is not a whole number.
export function parseCount(raw) {
	const text = String(raw ?? '').replace(/[\s.]/g, '');
	if (text === '') return 0;
	if (!/^\d+$/.test(text)) return null;
	return Number(text);
}

function readFleet(counts, ids) {
	const fleet = [];
	for (const id of ids) {
		const count = parseCount(counts[id]);
		if (count === null) return null;
		if (count > 0) fleet.push({ id, count });
	}
	return fleet;
}

function readTechs(levels) {
	const techs = {};
	for (const tech of TECHS) {
		const level = parseCount(levels[tech]);
		if (level === null || level > MAX_TECH_LEVEL) return null;
		techs[tech] = level;
	}
	return techs;
}

function serverNumber(value, fallback) {
	const n = Number(value);
	return value != null && value !== '' && Number.isFinite(n) && n >= 0 ? n : fallback;
}

function serverFlag(value) {
	return value === true || value === 1 || value === '1' || value === 'true';
}

// The universe settings that change a battle's aftermath. Without a universe,
// the defaults of most universes.
export function readUniverse(data) {
	const debrisFactor = serverNumber(data?.debrisFactor, DEFAULT_DEBRIS_FACTOR);
	return {
		known: Boolean(data),
		debrisFactor,
		defenseDebrisFactor: serverNumber(data?.debrisFactorDef, 0),
		deuteriumDebrisFactor: serverFlag(data?.deuteriumInDebris) ? debrisFactor : 0,
		repairFactor: serverNumber(data?.repairFactor, DEFAULT_REPAIR_FACTOR),
		hyperspaceMultiplier: serverNumber(data?.cargoHyperspaceTechMultiplier, DEFAULT_HYPERSPACE_MULTIPLIER),
	};
}

// Read the form into a battle the worker can run. `attacker` and `defender`
// hold `{ techs, ships, defenses? }` as typed; `resources` is what lies on the
// planet. Returns `{ ok: false, error }` so the view can explain what is wrong.
export function buildBattle({ attacker, defender, resources, hyperspaceLevel, plunderRatio, runs, data }) {
	const attackerTechs = readTechs(attacker.techs);
	const defenderTechs = readTechs(defender.techs);
	if (!attackerTechs || !defenderTechs) return { ok: false, error: 'tech' };

	const hyperspace = parseCount(hyperspaceLevel);
	if (hyperspace === null || hyperspace > MAX_TECH_LEVEL) return { ok: false, error: 'tech' };

	const attackerFleet = readFleet(attacker.ships, ATTACKER_SHIPS);
	const defenderFleet = readFleet(
		{ ...defender.ships, ...defender.defenses },
		[...DEFENDER_SHIPS, ...DEFENSES],
	);
	if (!attackerFleet || !defenderFleet) return { ok: false, error: 'count' };
	if (attackerFleet.length === 0) return { ok: false, error: 'attacker' };
	if (defenderFleet.length === 0) return { ok: false, error: 'defender' };

	const loot = {};
	for (const key of RESOURCE_KEYS) {
		const amount = parseCount(resources[key]);
		if (amount === null) return { ok: false, error: 'resources' };
		loot[key] = amount;
	}

	const universe = readUniverse(data);

	return {
		ok: true,
		battle: {
			attacker: { fleet: attackerFleet, techs: attackerTechs },
			defender: { fleet: defenderFleet, techs: defenderTechs },
			runs,
			options: {
				debrisFactor: universe.debrisFactor,
				defenseDebrisFactor: universe.defenseDebrisFactor,
				deuteriumDebrisFactor: universe.deuteriumDebrisFactor,
				repairFactor: universe.repairFactor,
				plunder: {
					resources: loot,
					ratio: plunderRatio,
					hyperspaceLevel: hyperspace,
					hyperspaceMultiplier: universe.hyperspaceMultiplier,
				},
			},
		},
		universe,
	};
}

// From plain `{ id, count }` entries to the library's `{ ship, count }`.
export function toLibraryFleet(fleet) {
	return fleet.map(({ id, count }) => ({ ship: unitModel(id), count }));
}

// Run `count` battles of a plain battle, from run `from` on. The seeds follow
// each other, so a set of runs is reproducible whatever the batch size.
export function runBattles(battle, seed, from, count) {
	const attacker = { ...battle.attacker, fleet: toLibraryFleet(battle.attacker.fleet) };
	const defender = { ...battle.defender, fleet: toLibraryFleet(battle.defender.fleet) };
	const results = [];
	for (let i = from; i < from + count; i += 1) {
		results.push(Ogame.Fleets.simulateCombat(attacker, defender, { ...battle.options, seed: seed + i }));
	}
	return results;
}

const LIBRARY_ID_BY_OGAME_ID = new Map(
	Object.entries(Destroyable).map(([id, model]) => [model.ogameId, Number(id)]),
);

// Back from `{ ship, count }` to plain entries the worker can post.
function toPlainFleet(fleet) {
	return fleet.map(({ ship, count }) => ({ id: LIBRARY_ID_BY_OGAME_ID.get(ship.ogameId), count }));
}

export function summariseBattles(results) {
	const stats = getCombatStatistics(results);
	return {
		...stats,
		attacker: {
			...stats.attacker,
			survivors: toPlainFleet(stats.attacker.survivors),
			losses: toPlainFleet(stats.attacker.losses),
		},
		defender: {
			...stats.defender,
			survivors: toPlainFleet(stats.defender.survivors),
			losses: toPlainFleet(stats.defender.losses),
			rebuilt: toPlainFleet(stats.defender.rebuilt),
		},
	};
}

function sum(resources) {
	return resources.metal + resources.crystal + resources.deuterium;
}

// What the report shows on top of the averages: the recyclers needed for the
// debris, and the attacker's balance (loot and debris, minus its losses; the
// deuterium burned on the way is not counted).
export function describeOutcome(stats) {
	const recycler = unitModel(RECYCLER_ID);
	const debris = sum(stats.debris);
	const gain = sum(stats.plunder) + debris;
	return {
		...stats,
		recyclers: Math.ceil(debris / recycler.cargo),
		balance: gain - sum(stats.attacker.lostResources),
	};
}
