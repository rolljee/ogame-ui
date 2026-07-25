// Case- and accent-insensitive matching, so "elysee" finds "Élysée".
//
// The proxy has the same two functions: filtering used to happen server-side
// only. It now also happens in the browser, on a roster already downloaded, and
// the two bundles cannot share a module — so the rule is written twice on
// purpose rather than shipped through an extra request.

export function normalizeForSearch(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

export function matchesSearch(value, search) {
	return normalizeForSearch(value).includes(normalizeForSearch(search));
}
