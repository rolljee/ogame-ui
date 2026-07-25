// Presentation of the player status the proxy decodes from players.xml.
//
// Shared: a player carries the same flags whether it is listed as a search
// result or as a member of an alliance.

// Order matters: this is also the order of the filter chips.
export const STATUS_FLAGS = [
	{ key: 'active', labelKey: 'pl.status.active', icon: '🟢' },
	{ key: 'inactive', labelKey: 'pl.status.inactive', icon: '💤' },
	{ key: 'longInactive', labelKey: 'pl.status.longInactive', icon: '🪦' },
	{ key: 'vacation', labelKey: 'pl.status.vacation', icon: '🏝️' },
	{ key: 'banned', labelKey: 'pl.status.banned', icon: '🚫' },
	{ key: 'outlaw', labelKey: 'pl.status.outlaw', icon: '☠️' },
	{ key: 'admin', labelKey: 'pl.status.admin', icon: '🛡️' },
];

// Badges to show on a row. Gameforge sets both `i` and `I` past 28 days of
// inactivity; only the longer one is worth a badge.
export function describeStatus(status) {
	if (!status) return [];
	return STATUS_FLAGS.filter((flag) => {
		if (!status[flag.key]) return false;
		return !(flag.key === 'inactive' && status.longInactive);
	});
}

// No selected chip means "everything"; several chips mean "any of these".
export function filterByStatus(items, selected) {
	if (!items) return [];
	if (!selected || selected.length === 0) return items;
	return items.filter((item) => selected.some((key) => item.status?.[key]));
}
