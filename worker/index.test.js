import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker from './index';

// "Anakin Vader" sorts before "Vader" alphabetically, so the exact-match rule
// is the only thing that can put "Vader" first.
const PLAYERS_XML = `<players timestamp="1"><player id="1" name="Darth Vader" alliance="1"/><player id="2" name="Anakin Vader" alliance="1"/><player id="3" name="Vader Junior"/><player id="4" name="Vader" alliance="2"/><player id="5" name="Luke"/></players>`;
const PLAYER_DATA_XML = `<playerData id="1" name="Darth Vader" timestamp="2"><positions><position type="0" score="10">3</position></positions><planets><planet id="9" name="Home" coords="1:1:1"/></planets></playerData>`;
const SERVER_DATA_XML = `<serverData timestamp="3"><name>Tucana</name><speed>10</speed></serverData>`;
// Member 99 is deliberately absent from players.xml: Gameforge generates the
// two documents minutes apart, so a member can be unresolvable.
const ALLIANCES_XML = `<alliances timestamp="4"><alliance id="1" name="The Wolf Army" tag="TWA" founder="1" foundDate="5"><player id="1"/><player id="2"/><player id="99"/></alliance><alliance id="2" name="Other" tag="OTH" founder="4" foundDate="6"><player id="4"/></alliance></alliances>`;
// One player with two planets (one carrying a moon), one with a single planet,
// and Luke deliberately absent: universe.xml lags by days, so a recent player
// has no coordinates yet.
const UNIVERSE_XML = `<universe timestamp="7" serverId="fr172"><planet id="1" player="1" name="Home" coords="1:1:1"><moon id="9" name="" size="8544"/></planet><planet id="2" player="1" name="Colo" coords="4:212:8"/><planet id="3" player="4" name="Solo" coords="2:194:8"/></universe>`;
const LOBBY_JSON = [
	{ language: 'fr', number: 172, name: 'Tucana', serverClosed: 0, settings: { economySpeed: 8 } },
	{ language: 'en', number: 101, name: 'Quantum', serverClosed: 0, settings: {} },
	{ language: 'fr', number: 5, name: 'Gone', serverClosed: 1, settings: {} },
];

// Serve a canned upstream body per URL fragment, so routing and normalization
// are exercised without touching the network.
function stubUpstream(bodies) {
	const calls = [];
	vi.stubGlobal(
		'fetch',
		vi.fn(async (url) => {
			calls.push(String(url));
			const match = Object.entries(bodies).find(([fragment]) => String(url).includes(fragment));
			if (!match) return new Response('not found', { status: 404 });
			const [, body] = match;
			if (typeof body === 'number') return new Response('upstream said no', { status: body });
			return new Response(body, { status: 200 });
		}),
	);
	return calls;
}

const get = (path, env, headers) =>
	worker.fetch(new Request(`https://api.test${path}`, { headers }), env);

beforeEach(() => {
	stubUpstream({
		'/api/players.xml': PLAYERS_XML,
		'/api/playerData.xml': PLAYER_DATA_XML,
		'/api/serverData.xml': SERVER_DATA_XML,
		'/api/alliances.xml': ALLIANCES_XML,
		'/api/universe.xml': UNIVERSE_XML,
		'lobby.ogame.gameforge.com': JSON.stringify(LOBBY_JSON),
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('CORS', () => {
	it('answers the preflight without a body', async () => {
		const response = await worker.fetch(
			new Request('https://api.test/universes', { method: 'OPTIONS' }),
		);
		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	// This header is the whole reason the proxy exists.
	it('sets the origin header on data responses', async () => {
		const response = await get('/universes');
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('honours a locked-down origin from the environment', async () => {
		const response = await get('/universes', { ALLOWED_ORIGIN: 'https://blog.rolljee.fr' });
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://blog.rolljee.fr');
	});

	// A browser rejects a list, so a listed caller must get its own origin back.
	it('echoes the caller when several origins are allowed', async () => {
		const env = { ALLOWED_ORIGIN: 'https://blog.rolljee.fr, http://localhost:3000' };
		const response = await get('/universes', env, { Origin: 'http://localhost:3000' });
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
	});

	it('does not echo an origin that is not allowed', async () => {
		const env = { ALLOWED_ORIGIN: 'https://blog.rolljee.fr, http://localhost:3000' };
		const response = await get('/universes', env, { Origin: 'https://evil.example.com' });
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://blog.rolljee.fr');
	});

	// Responses are cached; without Vary one caller's copy could be served to
	// another origin, which would either leak or wrongly block access.
	it('varies on Origin, since the responses are cacheable', async () => {
		const response = await get('/universes');
		expect(response.headers.get('Vary')).toBe('Origin');
		expect(response.headers.get('Cache-Control')).toMatch(/public/);
	});

	it('varies on Origin on the preflight too', async () => {
		const response = await worker.fetch(
			new Request('https://api.test/universes', { method: 'OPTIONS' }),
		);
		expect(response.headers.get('Vary')).toBe('Origin');
	});

	it('sets the header on errors too, so the browser can read them', async () => {
		const response = await get('/server-data');
		expect(response.status).toBe(400);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});
});

describe('routing', () => {
	it('rejects anything but GET', async () => {
		const response = await worker.fetch(
			new Request('https://api.test/universes', { method: 'POST' }),
		);
		expect(response.status).toBe(405);
	});

	it('lists the routes on an unknown path', async () => {
		const response = await get('/nope');
		expect(response.status).toBe(404);
		expect((await response.json()).routes).toContain('/universes');
	});

	it('tolerates a trailing slash', async () => {
		expect((await get('/universes/')).status).toBe(200);
	});

	it('caches successful responses in the browser', async () => {
		const response = await get('/universes');
		expect(response.headers.get('Cache-Control')).toMatch(/max-age=3600/);
	});

	it('never caches errors', async () => {
		const response = await get('/nope');
		expect(response.headers.get('Cache-Control')).toBe('no-store');
	});
});

describe('GET /universes', () => {
	it('returns the open universes', async () => {
		const { universes } = await (await get('/universes')).json();
		expect(universes.map((u) => u.name)).toEqual(['Quantum', 'Tucana']);
	});

	it('filters by language on request', async () => {
		const { universes } = await (await get('/universes?lang=fr')).json();
		expect(universes).toHaveLength(1);
		expect(universes[0]).toMatchObject({ number: 172, name: 'Tucana' });
	});
});

describe('GET /server-data', () => {
	it('returns the settings as JSON', async () => {
		const data = await (await get('/server-data?universe=172&lang=fr')).json();
		expect(data).toMatchObject({ name: 'Tucana', speed: 10 });
	});

	it('asks the right universe host', async () => {
		const calls = stubUpstream({ '/api/serverData.xml': SERVER_DATA_XML });
		await get('/server-data?universe=172&lang=fr');
		expect(calls[0]).toBe('https://s172-fr.ogame.gameforge.com/api/serverData.xml');
	});

	it('requires a universe', async () => {
		const response = await get('/server-data?lang=fr');
		expect(response.status).toBe(400);
		expect((await response.json()).error).toMatch(/universe/);
	});

	it('requires a language', async () => {
		expect((await get('/server-data?universe=172')).status).toBe(400);
	});

	it('refuses a host injected through the language', async () => {
		const response = await get('/server-data?universe=172&lang=evil.example.com');
		expect(response.status).toBe(400);
	});
});

describe('GET /players', () => {
	it('searches by name', async () => {
		const { players, total } = await (
			await get('/players?universe=172&lang=fr&search=vader')
		).json();
		expect(total).toBe(4);
		expect(players.map((p) => p.name)).toContain('Vader Junior');
		expect(players.map((p) => p.name)).not.toContain('Luke');
	});

	it('puts an exact name first, ahead of alphabetical order', async () => {
		const { players } = await (await get('/players?universe=172&lang=fr&search=vader')).json();
		expect(players[0].name).toBe('Vader');
		expect(players[1].name).toBe('Anakin Vader');
	});

	it('requires a search term, to avoid dumping the whole universe', async () => {
		const response = await get('/players?universe=172&lang=fr');
		expect(response.status).toBe(400);
		expect((await response.json()).error).toMatch(/search/);
	});

	// players.xml only knows the alliance id, so the name comes from the join.
	it('resolves the alliance of each match', async () => {
		const { players } = await (await get('/players?universe=172&lang=fr&search=vader')).json();
		const byName = Object.fromEntries(players.map((p) => [p.name, p.alliance]));
		expect(byName['Darth Vader']).toEqual({ id: '1', name: 'The Wolf Army', tag: 'TWA' });
		expect(byName['Vader Junior']).toBeNull();
	});

	it('leaves the alliance null when alliances.xml does not know that id', async () => {
		stubUpstream({
			'/api/players.xml': PLAYERS_XML,
			'/api/alliances.xml': '<alliances timestamp="4"/>',
		});
		const { players } = await (await get('/players?universe=172&lang=fr&search=vader')).json();
		expect(players.every((player) => player.alliance === null)).toBe(true);
	});
});

describe('GET /roster', () => {
	const roster = (query = '') => get(`/roster?universe=172&lang=fr${query}`);

	it('returns every player of the universe, sorted by name', async () => {
		const { players, total } = await (await roster()).json();
		expect(total).toBe(5);
		expect(players.map((p) => p.name)).toEqual([
			'Anakin Vader',
			'Darth Vader',
			'Luke',
			'Vader',
			'Vader Junior',
		]);
	});

	it('carries the alliance and the status of each player', async () => {
		const { players } = await (await roster()).json();
		const vader = players.find((p) => p.name === 'Darth Vader');
		expect(vader.alliance).toEqual({ id: '1', name: 'The Wolf Army', tag: 'TWA' });
		expect(vader.status).toMatchObject({ active: true });
	});

	// The coordinates are the whole point: no other document has them for
	// everyone, which is what a galaxy filter needs.
	it('carries the coordinates, sorted, with the moons flagged', async () => {
		const { players } = await (await roster()).json();
		expect(players.find((p) => p.name === 'Darth Vader').planets).toEqual([
			{ coords: '1:1:1', moon: true },
			{ coords: '4:212:8', moon: false },
		]);
	});

	it('keeps a player universe.xml does not know yet, without coordinates', async () => {
		const { players } = await (await roster()).json();
		expect(players.find((p) => p.name === 'Luke').planets).toEqual([]);
	});

	// universe.xml lags the other documents by days; the view says so, so it has
	// to be told.
	it('reports when the coordinates were generated', async () => {
		const data = await (await roster()).json();
		expect(data.coordsTimestamp).toBe(7);
		expect(data.timestamp).toBe(1);
	});

	it('needs no search term, unlike /players', async () => {
		expect((await roster()).status).toBe(200);
	});

	it('reports an upstream galaxy dump failure as 502', async () => {
		stubUpstream({
			'/api/players.xml': PLAYERS_XML,
			'/api/alliances.xml': ALLIANCES_XML,
			'/api/universe.xml': 503,
		});
		expect((await roster()).status).toBe(502);
	});
});

describe('GET /player', () => {
	it('returns scores and planets', async () => {
		const data = await (await get('/player?universe=172&lang=fr&id=1')).json();
		expect(data).toMatchObject({ id: '1', name: 'Darth Vader' });
		expect(data.planets[0].coords).toBe('1:1:1');
	});

	it('never downloads the 3.4 MB universe dump', async () => {
		const calls = stubUpstream({ '/api/playerData.xml': PLAYER_DATA_XML });
		await get('/player?universe=172&lang=fr&id=1');
		expect(calls.some((url) => url.includes('universe.xml'))).toBe(false);
	});

	it('requires a numeric id', async () => {
		expect((await get('/player?universe=172&lang=fr&id=1;drop')).status).toBe(400);
	});

	it('requires an id at all', async () => {
		expect((await get('/player?universe=172&lang=fr')).status).toBe(400);
	});
});

describe('GET /alliances', () => {
	it('searches by name or tag', async () => {
		const byTag = await (await get('/alliances?universe=172&lang=fr&search=TWA')).json();
		expect(byTag.alliances[0].name).toBe('The Wolf Army');

		const byName = await (await get('/alliances?universe=172&lang=fr&search=wolf')).json();
		expect(byName.alliances[0].tag).toBe('TWA');
	});

	// The ids alone are useless to the browser; /alliance resolves them instead.
	it('counts the members instead of shipping their ids', async () => {
		const { alliances } = await (
			await get('/alliances?universe=172&lang=fr&search=TWA')
		).json();
		expect(alliances[0].memberCount).toBe(3);
		expect(alliances[0].members).toBeUndefined();
	});

	it('ranks an exact tag first, then the biggest alliances', async () => {
		const { alliances } = await (await get('/alliances?universe=172&lang=fr&search=oth')).json();
		expect(alliances[0].tag).toBe('OTH');
	});

	it('requires a search term', async () => {
		expect((await get('/alliances?universe=172&lang=fr')).status).toBe(400);
	});
});

describe('GET /alliance', () => {
	const alliance = (id = 1) => get(`/alliance?universe=172&lang=fr&id=${id}`);

	it('returns the alliance with its members resolved to players', async () => {
		const data = await (await alliance()).json();
		expect(data).toMatchObject({ id: '1', name: 'The Wolf Army', tag: 'TWA', memberCount: 3 });
		expect(data.members[0]).toMatchObject({ id: '1', name: 'Darth Vader', founder: true });
		expect(data.members[0].status).toMatchObject({ active: true });
	});

	// The founder leads, then alphabetical order — "Anakin" would otherwise be
	// first — and a member missing from players.xml closes the list.
	it('orders founder, then names, then the unresolvable members', async () => {
		const { members } = await (await alliance()).json();
		expect(members.map((member) => member.name)).toEqual(['Darth Vader', 'Anakin Vader', null]);
		expect(members[2]).toMatchObject({ id: '99', status: null, founder: false });
	});

	it('answers 404 for an alliance the universe does not have', async () => {
		const response = await alliance(404);
		expect(response.status).toBe(404);
		expect((await response.json()).error).toMatch(/unknown alliance/);
	});

	it('requires a numeric id', async () => {
		expect((await alliance('1;drop')).status).toBe(400);
		expect((await get('/alliance?universe=172&lang=fr')).status).toBe(400);
	});
});

describe('upstream failures', () => {
	it('passes a missing document through as 404', async () => {
		stubUpstream({ '/api/serverData.xml': 404 });
		expect((await get('/server-data?universe=999&lang=fr')).status).toBe(404);
	});

	it('reports an upstream outage as 502, not 500', async () => {
		stubUpstream({ '/api/serverData.xml': 503 });
		const response = await get('/server-data?universe=172&lang=fr');
		expect(response.status).toBe(502);
		expect((await response.json()).error).toMatch(/503/);
	});

	it('reports malformed upstream XML as 502', async () => {
		stubUpstream({ '/api/serverData.xml': '<something-else/>' });
		expect((await get('/server-data?universe=172&lang=fr')).status).toBe(502);
	});
});
