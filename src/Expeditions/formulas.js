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

// The class bonuses older universes do not report: +50 % expedition finds for
// the Discoverer, +25 % cargo on cargo ships for the Collector.
const DEFAULT_EXPLORER_BONUS = 0.5;
const DEFAULT_COLLECTOR_CARGO_BONUS = 0.25;

export const CLASSES = ['explorer', 'collector', 'general'];

// The lifeform bonuses, as the player reads them on the in-game lifeform bonus
// page. The first three change the figures; the others only travel with the
// expedition and are shown for information.
export const BONUS_FIELDS = ['resources', 'explorer', 'cargo'];
export const INFO_FIELDS = ['ships', 'darkMatter', 'fleetLoss'];

// A percentage as typed: empty is 0, the French decimal comma is accepted.
// Returns a fraction (0.2 for "20"), or null when it cannot be one.
export function parsePercent(raw) {
	const text = String(raw ?? '').trim().replace(',', '.');
	if (text === '') return 0;
	if (!/^\d+(\.\d+)?$/.test(text)) return null;
	return Number(text) / 100;
}

function serverNumber(value, fallback) {
	const n = Number(value);
	return value != null && value !== '' && Number.isFinite(n) && n >= 0 ? n : fallback;
}

function isPositive(value) {
	return Number.isFinite(value) && value > 0;
}

// `data` is a serverData payload; the rest is what the player sets in the UI.
// Returns `{ ok: false, error }` rather than throwing, so the view can render a
// message while the universe is still loading or the level field is empty.
//
// `characterClass` is one of CLASSES; `bonuses` maps BONUS_FIELDS and
// INFO_FIELDS to the percentages typed in the form.
export function computeExpedition({
	data,
	hyperspaceLevel,
	pathfinder,
	characterClass = 'explorer',
	bonuses = {},
}) {
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

	const lifeform = {};
	for (const field of [...BONUS_FIELDS, ...INFO_FIELDS]) {
		lifeform[field] = parsePercent(bonuses[field]);
		if (lifeform[field] === null) return { ok: false, error: 'bonus', field };
	}

	const explorer = characterClass === 'explorer';
	const explorerBonus = serverNumber(data.explorerBonusIncreasedExpeditionOutcome, DEFAULT_EXPLORER_BONUS);
	// The Collector's bonus applies to cargo ships, which both of these are.
	const classCargo =
		characterClass === 'collector'
			? serverNumber(data.minerBonusIncreasedCargoCapacityForTradingShips, DEFAULT_COLLECTOR_CARGO_BONUS)
			: 0;

	const bonus = (level * hyperspaceMultiplier) / 100;
	const find = getExpeditionMaxFind({
		topScore,
		economySpeed: speed,
		explorer,
		pathfinder,
		explorerBonus,
		// The enhancement amplifies the Discoverer bonus: worthless to anyone else.
		lifeformExplorerBonus: explorer ? lifeform.explorer : 0,
		lifeformResourceBonus: lifeform.resources,
	});

	const ships = CARGO_SHIPS.map(({ key, id }) => {
		const capacity = getCargoCapacity(Destroyable[id], {
			hyperspaceLevel: level,
			hyperspaceMultiplier,
			bonus: classCargo + lifeform.cargo,
		});
		return { key, capacity, count: Math.ceil(find / capacity) };
	});

	// Only what the player actually has, in the order of INFO_FIELDS.
	const info = INFO_FIELDS.filter((field) => lifeform[field] > 0).map((field) => ({
		key: field,
		value: lifeform[field],
	}));

	return {
		ok: true,
		topScore,
		speed,
		hyperspaceMultiplier,
		bonus,
		characterClass,
		explorerBonus,
		classCargo,
		lifeform,
		maxFind: find,
		ships,
		info,
	};
}
