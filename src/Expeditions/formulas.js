// Expedition freight. The find and the cargo come from ogamejs
// (`Fleets.getExpeditionMaxFind`, `Fleets.getCargoCapacity`), the same code
// behind the `!oge` command of og-bot-discord.
//
// What a single expedition can bring back depends on the universe (economy
// speed and the score of its top player), not on the fleet sent. The fleet only
// decides whether there is room to carry it — hence the ship counts below.

import Ogame from 'ogamejs';

const { getExpeditionMaxFind, getCargoCapacity } = Ogame.Fleets;
const { Destroyable } = Ogame.models;

export const MAX_HYPERSPACE_LEVEL = 40;

// Library ids: 12 is the Large Cargo, 11 the Small Cargo.
const CARGO_SHIPS = [
	{ key: 'largeCargo', id: 12 },
	{ key: 'smallCargo', id: 11 },
];

// The Discoverer class bonus older universes do not report.
const DEFAULT_EXPLORER_BONUS = 0.5;

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

	const bonus = (level * hyperspaceMultiplier) / 100;
	const find = getExpeditionMaxFind({
		topScore,
		economySpeed: speed,
		explorer: true,
		pathfinder,
		explorerBonus: DEFAULT_EXPLORER_BONUS,
	});

	const ships = CARGO_SHIPS.map(({ key, id }) => {
		const capacity = getCargoCapacity(Destroyable[id], { hyperspaceLevel: level, hyperspaceMultiplier });
		return { key, capacity, count: Math.ceil(find / capacity) };
	});

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
