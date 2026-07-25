// Moon lock, ported from the `!ogl` command of
// https://github.com/rolljee/og-bot-discord (create-link.js).
//
// A moon appears when a battle leaves debris on the position, and the chance
// caps at 20 % — reached with 2 000 000 units of debris. "Locking" a moon means
// blowing up just enough of your own ships there to reach that cap, so the
// question is always: how many ships is that in this universe?
//
// Only metal and crystal ever land in the debris field, and the universe keeps
// `debrisFactor` of them.

import Ogame from 'ogamejs';

export const MOON_DEBRIS_THRESHOLD = 2000000;
export const MAX_MOON_CHANCE = 20;
export const MAX_POSITION = 15;

// Library ids, not OGame ids: 1 is the Light Fighter, 15 the Espionage Probe.
// The two ships everyone sacrifices, being the cheapest per hull.
export const LOCK_SHIPS = [1, 15];

export function shipModel(id) {
	return Ogame.models.Destroyable[id];
}

// What one ship leaves behind before the universe's debris factor is applied.
export function shipDebrisValue(id) {
	const { cost } = shipModel(id);
	return cost.metal + cost.crystal;
}

export function shipsForThreshold({ debrisFactor, shipId, threshold = MOON_DEBRIS_THRESHOLD }) {
	return Math.ceil(threshold / (debrisFactor * shipDebrisValue(shipId)));
}

// Accepts `1:2:3`, with or without spaces around the separators.
export function parseCoordinates(raw, { galaxies, systems } = {}) {
	const parts = String(raw).trim().split(':');
	if (parts.length !== 3) return null;

	const [galaxy, system, position] = parts.map((part) => Number(part.trim()));
	if (![galaxy, system, position].every((n) => Number.isInteger(n) && n > 0)) return null;
	if (galaxies && galaxy > galaxies) return null;
	if (systems && system > systems) return null;
	if (position > MAX_POSITION) return null;

	return { galaxy, system, position };
}

export function formatCoordinates({ galaxy, system, position }) {
	return `${galaxy}:${system}:${position}`;
}

// Deep link into the galaxy view of the universe. Only useful to someone
// already logged in, which is exactly who asks for it.
export function galaxyUrl({ universe, lang, galaxy, system, position }) {
	return (
		`https://s${universe}-${lang}.ogame.gameforge.com/game/index.php` +
		`?page=ingame&component=galaxy&galaxy=${galaxy}&system=${system}&position=${position}`
	);
}

// `data` is a serverData payload, `coordinates` the raw text field.
// Returns `{ ok: false, error }` so the view can explain what is missing.
export function computeMoonLock({ data, coordinates }) {
	if (!data) return { ok: false, error: 'universe' };

	const debrisFactor = Number(data.debrisFactor);
	if (!Number.isFinite(debrisFactor) || debrisFactor <= 0) {
		return { ok: false, error: 'data' };
	}

	const parsed = parseCoordinates(coordinates, {
		galaxies: Number(data.galaxies) || undefined,
		systems: Number(data.systems) || undefined,
	});
	if (!parsed) return { ok: false, error: 'coordinates' };

	return {
		ok: true,
		debrisFactor,
		coordinates: parsed,
		url: galaxyUrl({ universe: data.number, lang: data.language, ...parsed }),
		ships: LOCK_SHIPS.map((id) => ({
			id,
			model: shipModel(id),
			count: shipsForThreshold({ debrisFactor, shipId: id }),
		})),
	};
}
