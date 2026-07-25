// Presentation model for the alliances view.
//
// The proxy already resolved the member ids into players, so what is left is
// deciding what a roster should say: how many members are still playing, how a
// member without a name is labelled, and what an alliance homepage may link to.
// All pure, so it is tested without rendering anything.

import { STATUS_FLAGS, describeStatus } from '../components/status';

// The whole point of a roster over Discord's flat list: how much of the alliance
// is actually still playing. Counted on the same flags as the filter chips, so a
// player counted as inactive is one the "inactive" chip would keep.
export function countStatuses(members) {
	if (!members) return [];
	return STATUS_FLAGS.map((flag) => ({
		...flag,
		count: members.filter((member) =>
			describeStatus(member.status).some((shown) => shown.key === flag.key),
		).length,
	})).filter((flag) => flag.count > 0);
}

// Gameforge's flags are not exclusive: a member away on holiday who also stopped
// logging in is `vi`, so they land in two counts and the chips add up to more
// than the roster. True when that happens, so the view can say it rather than
// look like it cannot count.
//
// Counted against the members that carry a status, not the roster size: an
// unresolved member has none, and would otherwise hide the overlap.
export function countsOverlap(members) {
	if (!members) return false;
	const badged = members.filter((member) => describeStatus(member.status).length > 0).length;
	return countStatuses(members).reduce((sum, flag) => sum + flag.count, 0) > badged;
}

// A member row. `name` is null when players.xml did not have that id — the two
// documents are generated minutes apart — and the id is all we can show.
export function describeMembers(members) {
	if (!members) return [];
	return members.map((member) => ({
		...member,
		label: member.name ?? `#${member.id}`,
		unknown: member.name === null || member.name === undefined,
	}));
}

// An alliance homepage is player-supplied text coming from a third party: only
// let a plain http(s) link through, never `javascript:` or a relative path that
// would resolve against this app.
export function safeHomepage(homepage) {
	if (!homepage) return null;
	try {
		const url = new URL(String(homepage).trim());
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
	} catch {
		return null;
	}
}

// foundDate is a Unix timestamp in seconds; the year alone is what a roster
// cares about, and it needs no locale-dependent formatting.
export function foundYear(foundDate) {
	if (!foundDate) return null;
	const year = new Date(foundDate * 1000).getUTCFullYear();
	return Number.isFinite(year) ? year : null;
}
