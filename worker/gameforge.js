// Upstream access to Gameforge's public OGame API.
//
// The API itself is fine — it is only missing CORS headers, which is why the
// browser cannot call it directly and this worker exists. Everything here is
// read-only and stateless: fetch an XML document, hand back plain JSON.

import { XMLParser } from 'fast-xml-parser';

// Community codes advertised by the lobby API. Kept as an allowlist so a
// request can never be turned into an arbitrary hostname.
export const LANGUAGES = [
	'ar', 'br', 'cz', 'de', 'dk', 'en', 'es', 'fr', 'gr', 'hr', 'hu', 'it',
	'jp', 'mx', 'nl', 'pl', 'pt', 'ro', 'ru', 'si', 'sk', 'tr', 'tw', 'us',
];

export const LOBBY_URL = 'https://lobby.ogame.gameforge.com/api/servers';

// Score categories exposed by playerData.xml. Gameforge also emits types we
// have no documented meaning for; those are passed through with key: null
// rather than given an invented label.
const SCORE_CATEGORIES = {
	0: 'total',
	1: 'economy',
	2: 'research',
	3: 'military',
	4: 'militaryBuilt',
	5: 'militaryDestroyed',
	6: 'militaryLost',
	7: 'honour',
};

export class UpstreamError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
	// Coordinates like "1:1:2" and huge scores must survive as strings; we cast
	// explicitly where a number is actually wanted.
	parseAttributeValue: false,
	parseTagValue: false,
});

// fast-xml-parser collapses a single child into an object instead of an array.
function asArray(value) {
	if (value === undefined || value === null) return [];
	return Array.isArray(value) ? value : [value];
}

function toNumber(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

export function serverBaseUrl(universe, lang) {
	if (!/^\d{1,4}$/.test(String(universe))) {
		throw new UpstreamError(`invalid universe: ${universe}`, 400);
	}
	if (!LANGUAGES.includes(String(lang))) {
		throw new UpstreamError(`invalid language: ${lang}`, 400);
	}
	return `https://s${universe}-${lang}.ogame.gameforge.com`;
}

// players.xml packs several independent flags into one attribute; an empty
// attribute means a plain active player.
export function decodeStatus(raw) {
	const flags = raw === undefined || raw === null ? '' : String(raw);
	return {
		raw: flags,
		active: flags === '',
		vacation: flags.includes('v'),
		inactive: flags.includes('i'),
		longInactive: flags.includes('I'),
		banned: flags.includes('b'),
		admin: flags.includes('a'),
		outlaw: flags.includes('o'),
	};
}

// --- Normalizers (pure: XML string in, JSON-ready object out) ---------------

export function parseServerData(xml) {
	const root = parser.parse(xml).serverData;
	if (!root) throw new UpstreamError('unexpected serverData payload', 502);

	const data = { timestamp: toNumber(root.timestamp) };
	for (const [key, value] of Object.entries(root)) {
		// Attributes of the root element are metadata, not settings.
		if (key === 'timestamp' || key === 'serverId') continue;
		const asNum = Number(value);
		data[key] = value !== '' && Number.isFinite(asNum) ? asNum : value;
	}
	return data;
}

export function parsePlayers(xml) {
	const root = parser.parse(xml).players;
	if (!root) throw new UpstreamError('unexpected players payload', 502);

	return {
		timestamp: toNumber(root.timestamp),
		players: asArray(root.player).map((player) => ({
			id: String(player.id),
			name: player.name,
			alliance: player.alliance ? String(player.alliance) : null,
			status: decodeStatus(player.status),
		})),
	};
}

function parsePlanet(planet) {
	const moon = asArray(planet.moon)[0];
	return {
		id: String(planet.id),
		name: planet.name,
		coords: planet.coords,
		moon: moon
			? { id: String(moon.id), name: moon.name, size: toNumber(moon.size) }
			: null,
	};
}

export function parsePlayerData(xml) {
	const root = parser.parse(xml).playerData;
	if (!root) throw new UpstreamError('unexpected playerData payload', 502);

	const positions = asArray(root.positions?.position).map((position) => ({
		type: toNumber(position.type),
		key: SCORE_CATEGORIES[position.type] ?? null,
		score: toNumber(position.score),
		rank: toNumber(position['#text']),
		ships: position.ships === undefined ? null : toNumber(position.ships),
	}));

	return {
		id: String(root.id),
		name: root.name,
		timestamp: toNumber(root.timestamp),
		scores: positions,
		planets: asArray(root.planets?.planet).map(parsePlanet).sort(byCoords),
	};
}

export function parseAlliances(xml) {
	const root = parser.parse(xml).alliances;
	if (!root) throw new UpstreamError('unexpected alliances payload', 502);

	return {
		timestamp: toNumber(root.timestamp),
		alliances: asArray(root.alliance).map((alliance) => ({
			id: String(alliance.id),
			name: alliance.name,
			tag: alliance.tag,
			founder: alliance.founder ? String(alliance.founder) : null,
			foundDate: toNumber(alliance.foundDate),
			homepage: alliance.homepage || null,
			open: alliance.open === '1',
			members: asArray(alliance.player).map((player) => String(player.id)),
		})),
	};
}

// The lobby list is already JSON; we only trim it to what a picker needs and
// drop the universes nobody can join any more.
export function normalizeUniverses(servers) {
	return servers
		.filter((server) => Number(server.serverClosed) !== 1)
		.map((server) => ({
			language: server.language,
			number: server.number,
			name: server.name,
			playerCount: server.playerCount,
			playersOnline: server.playersOnline,
			opened: server.opened,
			settings: server.settings ?? {},
		}))
		.sort(
			(a, b) => a.language.localeCompare(b.language) || a.number - b.number,
		);
}

// --- Sorting & filtering ---------------------------------------------------

function byCoords(a, b) {
	const [ga, sa, pa] = String(a.coords).split(':').map(Number);
	const [gb, sb, pb] = String(b.coords).split(':').map(Number);
	return ga - gb || sa - sb || pa - pb;
}

// Case- and accent-insensitive substring match, so "elysee" finds "Élysée".
export function normalizeForSearch(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export function matchesSearch(value, search) {
	return normalizeForSearch(value).includes(normalizeForSearch(search));
}
