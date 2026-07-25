// Expedition freight, ported from the `!oge` command of
// https://github.com/rolljee/og-bot-discord (expeditions.js).
//
// What a single expedition can bring back depends on the universe (economy
// speed and the score of its top player), not on the fleet sent. The fleet only
// decides whether there is room to carry it — hence the ship counts below.

export const LARGE_CARGO_BASE = 25000;
export const SMALL_CARGO_BASE = 5000;
export const MAX_HYPERSPACE_LEVEL = 40;

// The maximum find is tiered by the top player's score: the richer the
// universe, the bigger the haul. Thresholds are exclusive upper bounds.
export const FIND_TIERS = [
	{ below: 1e4, base: 40000 },
	{ below: 1e5, base: 500000 },
	{ below: 1e6, base: 1200000 },
	{ below: 5e6, base: 1800000 },
	{ below: 25e6, base: 2400000 },
	{ below: 50e6, base: 3000000 },
	{ below: 75e6, base: 3600000 },
	{ below: 100e6, base: 4200000 },
];

// Above the last threshold every universe shares the same ceiling.
export const TOP_TIER_BASE = 5000000;

export function findBase(topScore) {
	const tier = FIND_TIERS.find(({ below }) => topScore < below);
	return tier ? tier.base : TOP_TIER_BASE;
}

// A Pathfinder in the fleet doubles the find. The 1.5 factor and the economy
// speed are the universe's own multipliers.
//
// The bot also floors the result at 200 units; with a 40 000 base that floor
// can never bind, so it is left out here.
export function maxFind({ speed, topScore, pathfinder }) {
	return 1.5 * speed * (pathfinder ? 2 : 1) * findBase(topScore);
}

// Hyperspace technology adds a percentage of the ship's base cargo per level,
// and the percentage itself is a server setting (`cargoHyperspaceTechMultiplier`).
export function cargoBonus({ hyperspaceLevel, hyperspaceMultiplier }) {
	return (hyperspaceLevel * hyperspaceMultiplier) / 100;
}

function isPositive(value) {
	return Number.isFinite(value) && value > 0;
}

// `data` is a serverData payload; the rest is what the player sets in the UI.
// Returns `{ ok: false, error }` rather than throwing, so the view can render a
// message while the universe is still loading or the level field is empty.
export function computeExpedition({ data, hyperspaceLevel, pathfinder }) {
	if (!data) return { ok: false, error: 'universe' };

	const speed = Number(data.speed);
	const topScore = Number(data.topScore);
	const hyperspaceMultiplier = Number(data.cargoHyperspaceTechMultiplier);

	if (!isPositive(speed) || !isPositive(topScore) || !isPositive(hyperspaceMultiplier)) {
		return { ok: false, error: 'data' };
	}

	const level = Number(hyperspaceLevel);
	if (
		hyperspaceLevel === '' ||
		!Number.isInteger(level) ||
		level < 0 ||
		level > MAX_HYPERSPACE_LEVEL
	) {
		return { ok: false, error: 'level' };
	}

	const bonus = cargoBonus({ hyperspaceLevel: level, hyperspaceMultiplier });
	const find = maxFind({ speed, topScore, pathfinder });

	const ships = [
		{ key: 'largeCargo', capacity: LARGE_CARGO_BASE * (1 + bonus) },
		{ key: 'smallCargo', capacity: SMALL_CARGO_BASE * (1 + bonus) },
	].map((ship) => ({ ...ship, count: Math.ceil(find / ship.capacity) }));

	return {
		ok: true,
		topScore,
		speed,
		hyperspaceMultiplier,
		bonus,
		maxFind: find,
		ships,
	};
}
