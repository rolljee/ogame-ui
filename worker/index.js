// CORS proxy for Gameforge's public OGame API.
//
// The browser cannot call `s{n}-{lang}.ogame.gameforge.com` directly: those
// endpoints send no Access-Control-Allow-Origin header. This worker fetches
// them server-side, normalizes the XML to JSON and serves it with CORS.
//
// It also keeps the heavy documents off the wire by filtering upstream and
// returning only what a view needs: a name search is 236 B rather than the
// 245 kB of players.xml, and a player's planets come from playerData.xml rather
// than the whole galaxy dump. The one route that does read universe.xml scans it
// for two attributes instead of parsing it (see `scanPlanets`).

import {
	LOBBY_URL,
	UpstreamError,
	indexById,
	matchesSearch,
	normalizeForSearch,
	normalizeUniverses,
	parseAlliances,
	parsePlayerData,
	parsePlayers,
	parseServerData,
	resolveMembers,
	scanPlanets,
	serverBaseUrl,
	summarizeAlliance,
	universeTimestamp,
} from './gameforge.js';

// Upstream regenerates these documents roughly once a day, so caching for an
// hour is both safe and a big win: one edge fetch serves every visitor.
const CACHE_TTL = 3600;

// Enough to fill a picker without shipping thousands of rows to the browser.
const MAX_RESULTS = 50;

// ALLOWED_ORIGIN is either `*` or a comma-separated allowlist. A browser only
// accepts an exact origin, so a listed caller gets its own origin echoed back.
function corsHeaders(request, env) {
	const allowed = String(env?.ALLOWED_ORIGIN || '*')
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);
	const origin = request.headers.get('Origin');
	const allowOrigin = allowed.includes('*')
		? '*'
		: (origin && allowed.includes(origin) ? origin : allowed[0]);

	return {
		'Access-Control-Allow-Origin': allowOrigin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
		// Responses are cacheable and this header depends on the caller, so the
		// cache must not serve one origin's copy to another.
		Vary: 'Origin',
	};
}

function json(data, { status = 200, ttl = 0, cors = {} } = {}) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': ttl ? `public, max-age=${ttl}` : 'no-store',
			...cors,
		},
	});
}

// Every upstream document is public and immutable for the day, so we let the
// Cloudflare edge cache hold it (`cf` is ignored outside Workers).
async function fetchUpstream(url) {
	const response = await fetch(url, {
		cf: { cacheTtl: CACHE_TTL, cacheEverything: true },
		headers: { Accept: 'application/xml, application/json' },
	});
	if (!response.ok) {
		throw new UpstreamError(
			`upstream ${url} responded ${response.status}`,
			response.status === 404 ? 404 : 502,
		);
	}
	return response;
}

function requireParam(params, name) {
	const value = params.get(name);
	if (!value) throw new UpstreamError(`missing parameter: ${name}`, 400);
	return value;
}

// A universe is always addressed the same way, so resolve it once per route.
function resolveBase(params) {
	return serverBaseUrl(requireParam(params, 'universe'), requireParam(params, 'lang'));
}

async function handleUniverses(params) {
	const response = await fetchUpstream(LOBBY_URL);
	const universes = normalizeUniverses(await response.json());
	const lang = params.get('lang');
	return { universes: lang ? universes.filter((u) => u.language === lang) : universes };
}

async function handleServerData(params) {
	const response = await fetchUpstream(`${resolveBase(params)}/api/serverData.xml`);
	return parseServerData(await response.text());
}

// The two documents a view is built from. They are fetched together because a
// player is only fully described by both, and both are edge-cached anyway.
async function fetchPlayers(base) {
	const response = await fetchUpstream(`${base}/api/players.xml`);
	return parsePlayers(await response.text());
}

async function fetchAlliances(base) {
	const response = await fetchUpstream(`${base}/api/alliances.xml`);
	return parseAlliances(await response.text());
}

async function handlePlayers(params) {
	const search = requireParam(params, 'search');
	const base = resolveBase(params);
	const [{ timestamp, players }, { alliances }] = await Promise.all([
		fetchPlayers(base),
		fetchAlliances(base),
	]);

	const matches = players.filter((player) => matchesSearch(player.name, search));
	const needle = normalizeForSearch(search);
	const isExact = (player) => (normalizeForSearch(player.name) === needle ? 0 : 1);
	const byId = indexById(alliances);

	return {
		timestamp,
		total: matches.length,
		// An exact name first — that is usually the player being looked up.
		players: matches
			.sort((a, b) => isExact(a) - isExact(b) || a.name.localeCompare(b.name))
			.slice(0, MAX_RESULTS)
			// players.xml only carries the alliance id; resolve it here so the
			// browser never has to download alliances.xml to show a tag.
			.map((player) => {
				const alliance = player.alliance ? byId.get(player.alliance) : undefined;
				return {
					...player,
					alliance: alliance
						? { id: alliance.id, name: alliance.name, tag: alliance.tag }
						: null,
				};
			}),
	};
}

function requireId(params) {
	const id = requireParam(params, 'id');
	if (!/^\d{1,12}$/.test(id)) throw new UpstreamError(`invalid id: ${id}`, 400);
	return id;
}

// The whole roster of a universe, so the browser can filter and sort it without
// a round trip per keystroke: names, alliances, statuses and coordinates in one
// document. About 520 kB of JSON on s282, which gzips to 51 kB and is cached for
// an hour — cheaper than it looks, and it is what lets the view offer a galaxy
// filter, which no single upstream document supports.
async function handleRoster(params) {
	const base = resolveBase(params);
	const [{ timestamp, players }, { alliances }, universeXml] = await Promise.all([
		fetchPlayers(base),
		fetchAlliances(base),
		fetchUpstream(`${base}/api/universe.xml`).then((response) => response.text()),
	]);

	const byAlliance = indexById(alliances);
	const planetsByPlayer = scanPlanets(universeXml);

	return {
		timestamp,
		// universe.xml lags the other documents by days, so the view can say how
		// old the coordinates are instead of implying they are live.
		coordsTimestamp: universeTimestamp(universeXml),
		total: players.length,
		players: players
			.map((player) => {
				const alliance = player.alliance ? byAlliance.get(player.alliance) : undefined;
				return {
					...player,
					alliance: alliance
						? { id: alliance.id, name: alliance.name, tag: alliance.tag }
						: null,
					planets: planetsByPlayer.get(player.id) ?? [],
				};
			})
			.sort((a, b) => a.name.localeCompare(b.name)),
	};
}

async function handlePlayer(params) {
	const id = requireId(params);

	// playerData.xml already carries the planets and their moons, with names and
	// moon sizes universe.xml does not have, and it is days fresher.
	const response = await fetchUpstream(`${resolveBase(params)}/api/playerData.xml?id=${id}`);
	return parsePlayerData(await response.text());
}

async function handleAlliances(params) {
	const search = requireParam(params, 'search');
	const { timestamp, alliances } = await fetchAlliances(resolveBase(params));
	const matches = alliances.filter(
		(alliance) => matchesSearch(alliance.name, search) || matchesSearch(alliance.tag, search),
	);
	const needle = normalizeForSearch(search);
	// A tag is what players actually type, so an exact tag wins the top spot.
	const isExact = (alliance) => (normalizeForSearch(alliance.tag) === needle ? 0 : 1);

	return {
		timestamp,
		total: matches.length,
		// Member ids are useless before they are resolved into names, which is
		// what /alliance does for the one alliance being looked at.
		alliances: matches
			.sort((a, b) => isExact(a) - isExact(b) || b.members.length - a.members.length)
			.slice(0, MAX_RESULTS)
			.map(summarizeAlliance),
	};
}

async function handleAlliance(params) {
	const id = requireId(params);
	const base = resolveBase(params);
	const [{ timestamp, alliances }, { players }] = await Promise.all([
		fetchAlliances(base),
		fetchPlayers(base),
	]);

	const alliance = alliances.find((candidate) => candidate.id === id);
	if (!alliance) throw new UpstreamError(`unknown alliance: ${id}`, 404);

	return { timestamp, ...resolveMembers(alliance, players) };
}

const ROUTES = {
	'/universes': handleUniverses,
	'/server-data': handleServerData,
	'/players': handlePlayers,
	'/roster': handleRoster,
	'/player': handlePlayer,
	'/alliances': handleAlliances,
	'/alliance': handleAlliance,
};

export default {
	async fetch(request, env) {
		const cors = corsHeaders(request, env);

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: cors });
		}
		if (request.method !== 'GET') {
			return json({ error: 'method not allowed' }, { status: 405, cors });
		}

		const url = new URL(request.url);
		const handler = ROUTES[url.pathname.replace(/\/$/, '')];

		if (!handler) {
			return json({ error: 'not found', routes: Object.keys(ROUTES) }, { status: 404, cors });
		}

		try {
			const data = await handler(url.searchParams);
			return json(data, { ttl: CACHE_TTL, cors });
		} catch (error) {
			const status = error instanceof UpstreamError ? error.status : 500;
			// Upstream failures are the interesting ones; surface the reason.
			return json({ error: error.message }, { status, cors });
		}
	},
};
