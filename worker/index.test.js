import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker from './index';

// "Anakin Vader" sorts before "Vader" alphabetically, so the exact-match rule
// is the only thing that can put "Vader" first.
const PLAYERS_XML = `<players timestamp="1"><player id="1" name="Darth Vader"/><player id="2" name="Anakin Vader"/><player id="3" name="Vader Junior"/><player id="4" name="Vader"/><player id="5" name="Luke"/></players>`;
const PLAYER_DATA_XML = `<playerData id="1" name="Darth Vader" timestamp="2"><positions><position type="0" score="10">3</position></positions><planets><planet id="9" name="Home" coords="1:1:1"/></planets></playerData>`;
const SERVER_DATA_XML = `<serverData timestamp="3"><name>Tucana</name><speed>10</speed></serverData>`;
const ALLIANCES_XML = `<alliances timestamp="4"><alliance id="1" name="The Wolf Army" tag="TWA" founder="1" foundDate="5"><player id="1"/></alliance><alliance id="2" name="Other" tag="OTH" founder="2" foundDate="6"/></alliances>`;
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

	it('lists the member ids', async () => {
		const { alliances } = await (
			await get('/alliances?universe=172&lang=fr&search=TWA')
		).json();
		expect(alliances[0].members).toEqual(['1']);
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
