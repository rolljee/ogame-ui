// Client for the CORS proxy in `worker/`. The browser cannot reach Gameforge's
// API directly (no Access-Control-Allow-Origin header upstream), so every call
// goes through the worker, which also normalizes XML to JSON.
//
// Point VITE_API_URL at the deployed worker; it defaults to `wrangler dev`.

export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8787';

export class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

async function request(path, params = {}, { signal } = {}) {
	const url = new URL(path, API_URL);
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			url.searchParams.set(key, value);
		}
	}

	let response;
	try {
		response = await fetch(url, { signal });
	} catch (error) {
		// A network failure here usually means the proxy is down, not the game API.
		if (error.name === 'AbortError') throw error;
		throw new ApiError(`cannot reach the API at ${API_URL}`, 0);
	}

	const payload = await response.json().catch(() => null);
	if (!response.ok) {
		throw new ApiError(payload?.error || `request failed (${response.status})`, response.status);
	}
	return payload;
}

// Every open universe, sorted by language then number. `lang` narrows the list.
export async function fetchUniverses({ lang } = {}, options) {
	const { universes } = await request('/universes', { lang }, options);
	return universes;
}

export function fetchServerData({ universe, lang }, options) {
	return request('/server-data', { universe, lang }, options);
}

// The whole roster of a universe in one document — names, alliances, statuses
// and coordinates — so the view can filter and sort without a request per
// keystroke. Around 51 kB gzipped on s282, cached for an hour.
export function fetchRoster({ universe, lang }, options) {
	return request('/roster', { universe, lang }, options);
}

export function fetchPlayer({ universe, lang, id }, options) {
	return request('/player', { universe, lang, id }, options);
}

// Summaries only (no member ids): use `fetchAlliance` for the member list.
export async function searchAlliances({ universe, lang, search }, options) {
	const { alliances, total } = await request('/alliances', { universe, lang, search }, options);
	return { alliances, total };
}

// One alliance with its members already resolved to names and statuses.
export function fetchAlliance({ universe, lang, id }, options) {
	return request('/alliance', { universe, lang, id }, options);
}
