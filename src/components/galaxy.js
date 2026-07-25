// Coordinates and galaxy links, shared by every view that shows a position.

export const MAX_POSITION = 15;

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
