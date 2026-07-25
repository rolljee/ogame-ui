import { describe, it, expect, vi, afterEach } from 'vitest';
import {
	API_URL,
	ApiError,
	fetchAlliance,
	fetchPlayer,
	fetchServerData,
	fetchUniverses,
	searchAlliances,
	searchPlayers,
} from './ogame';

function stubFetch(body, { status = 200 } = {}) {
	const spy = vi.fn(async () => new Response(JSON.stringify(body), { status }));
	vi.stubGlobal('fetch', spy);
	return spy;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('fetchUniverses', () => {
	it('unwraps the universes list', async () => {
		stubFetch({ universes: [{ language: 'fr', number: 172, name: 'Tucana' }] });
		await expect(fetchUniverses()).resolves.toEqual([
			{ language: 'fr', number: 172, name: 'Tucana' },
		]);
	});

	it('passes the language filter through', async () => {
		const spy = stubFetch({ universes: [] });
		await fetchUniverses({ lang: 'fr' });
		expect(spy.mock.calls[0][0].toString()).toBe(`${API_URL}/universes?lang=fr`);
	});

	it('omits an empty filter instead of sending lang=', async () => {
		const spy = stubFetch({ universes: [] });
		await fetchUniverses({ lang: '' });
		expect(spy.mock.calls[0][0].toString()).toBe(`${API_URL}/universes`);
	});
});

describe('fetchServerData', () => {
	it('builds the query from the universe', async () => {
		const spy = stubFetch({ name: 'Tucana' });
		await fetchServerData({ universe: 172, lang: 'fr' });
		expect(spy.mock.calls[0][0].toString()).toBe(
			`${API_URL}/server-data?universe=172&lang=fr`,
		);
	});
});

describe('searchPlayers', () => {
	it('returns the matches and the total', async () => {
		stubFetch({ players: [{ id: '1', name: 'Vader' }], total: 1 });
		await expect(searchPlayers({ universe: 172, lang: 'fr', search: 'vader' })).resolves.toEqual({
			players: [{ id: '1', name: 'Vader' }],
			total: 1,
		});
	});

	it('encodes a search term with spaces', async () => {
		const spy = stubFetch({ players: [], total: 0 });
		await searchPlayers({ universe: 172, lang: 'fr', search: 'darth vader' });
		expect(spy.mock.calls[0][0].searchParams.get('search')).toBe('darth vader');
	});
});

describe('fetchPlayer and searchAlliances', () => {
	it('fetches one player', async () => {
		stubFetch({ id: '1', name: 'Vader', planets: [] });
		await expect(fetchPlayer({ universe: 172, lang: 'fr', id: '1' })).resolves.toMatchObject({
			name: 'Vader',
		});
	});

	it('unwraps the alliances list', async () => {
		stubFetch({ alliances: [{ tag: 'TWA' }], total: 1 });
		await expect(
			searchAlliances({ universe: 172, lang: 'fr', search: 'twa' }),
		).resolves.toMatchObject({ total: 1 });
	});

	it('fetches one alliance by id', async () => {
		const spy = stubFetch({ id: '1', tag: 'TWA', members: [] });
		await expect(fetchAlliance({ universe: 172, lang: 'fr', id: '1' })).resolves.toMatchObject({
			tag: 'TWA',
		});
		expect(spy.mock.calls[0][0].toString()).toBe(
			`${API_URL}/alliance?universe=172&lang=fr&id=1`,
		);
	});
});

describe('error handling', () => {
	it('surfaces the error message sent by the proxy', async () => {
		stubFetch({ error: 'missing parameter: search' }, { status: 400 });
		await expect(searchPlayers({ universe: 172, lang: 'fr' })).rejects.toThrow(
			'missing parameter: search',
		);
	});

	it('reports the HTTP status on the error', async () => {
		stubFetch({ error: 'nope' }, { status: 502 });
		await expect(fetchServerData({ universe: 172, lang: 'fr' })).rejects.toMatchObject({
			status: 502,
			name: 'ApiError',
		});
	});

	it('falls back to a generic message when the body is not JSON', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('boom', { status: 500 })));
		await expect(fetchServerData({ universe: 172, lang: 'fr' })).rejects.toThrow(
			'request failed (500)',
		);
	});

	it('says the proxy is unreachable when the network fails', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('Failed to fetch'); }));
		await expect(fetchUniverses()).rejects.toThrow(/cannot reach the API/);
	});

	it('lets an abort propagate untouched', async () => {
		const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
		vi.stubGlobal('fetch', vi.fn(async () => { throw abort; }));
		await expect(fetchUniverses()).rejects.toBe(abort);
	});

	it('is an ApiError, so callers can branch on it', async () => {
		stubFetch({ error: 'nope' }, { status: 404 });
		await expect(fetchUniverses()).rejects.toBeInstanceOf(ApiError);
	});
});
