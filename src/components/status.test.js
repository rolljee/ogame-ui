import { describe, it, expect } from 'vitest';
import { describeStatus, filterByStatus } from './status';

const status = (over = {}) => ({
	raw: '',
	active: false,
	vacation: false,
	inactive: false,
	longInactive: false,
	banned: false,
	admin: false,
	outlaw: false,
	...over,
});

describe('describeStatus', () => {
	it('badges an active player', () => {
		expect(describeStatus(status({ active: true })).map((f) => f.key)).toEqual(['active']);
	});

	// Gameforge sets both `i` and `I` past 28 days; two badges would say the
	// same thing twice.
	it('keeps only the longer inactivity', () => {
		const flags = describeStatus(status({ inactive: true, longInactive: true }));
		expect(flags.map((f) => f.key)).toEqual(['longInactive']);
	});

	it('shows every independent flag', () => {
		const flags = describeStatus(status({ vacation: true, banned: true }));
		expect(flags.map((f) => f.key)).toEqual(['vacation', 'banned']);
	});

	it('handles a missing status', () => {
		expect(describeStatus(undefined)).toEqual([]);
	});

	// An alliance member can be missing from players.xml altogether.
	it('handles a null status', () => {
		expect(describeStatus(null)).toEqual([]);
	});
});

describe('filterByStatus', () => {
	const players = [
		{ id: '1', name: 'Ada', status: status({ active: true }) },
		{ id: '2', name: 'Bo', status: status({ vacation: true }) },
		{ id: '3', name: 'Cy', status: status({ inactive: true, longInactive: true }) },
	];

	it('keeps everyone when nothing is selected', () => {
		expect(filterByStatus(players, [])).toHaveLength(3);
	});

	it('keeps the players matching any selected status', () => {
		expect(filterByStatus(players, ['vacation']).map((p) => p.id)).toEqual(['2']);
		expect(filterByStatus(players, ['active', 'vacation']).map((p) => p.id)).toEqual(['1', '2']);
	});

	it('counts a long inactivity as an inactivity', () => {
		expect(filterByStatus(players, ['inactive']).map((p) => p.id)).toEqual(['3']);
	});

	it('handles a missing list', () => {
		expect(filterByStatus(undefined, ['active'])).toEqual([]);
	});

	// A member the proxy could not resolve has no status at all.
	it('drops an item without a status when filtering', () => {
		expect(filterByStatus([{ id: '9', status: null }], ['active'])).toEqual([]);
	});
});
