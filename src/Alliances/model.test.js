import { describe, it, expect } from 'vitest';
import { countStatuses, describeMembers, foundYear, safeHomepage } from './model';

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

const member = (id, name, over) => ({ id, name, status: status(over), founder: false });

describe('countStatuses', () => {
	const members = [
		member('1', 'Ada', { active: true }),
		member('2', 'Bo', { active: true }),
		member('3', 'Cy', { inactive: true, longInactive: true }),
		{ id: '4', name: null, status: null, founder: false },
	];

	it('counts the members per status, in the order of the chips', () => {
		expect(countStatuses(members).map(({ key, count }) => [key, count])).toEqual([
			['active', 2],
			['longInactive', 1],
		]);
	});

	// A 28-day inactive player would otherwise be counted twice, once per flag.
	it('counts a long inactivity once, as the longer flag', () => {
		const keys = countStatuses(members).map((flag) => flag.key);
		expect(keys).not.toContain('inactive');
	});

	it('omits a status nobody has', () => {
		expect(countStatuses(members).map((flag) => flag.key)).not.toContain('banned');
	});

	it('handles a missing member list', () => {
		expect(countStatuses(undefined)).toEqual([]);
	});
});

describe('describeMembers', () => {
	it('labels a member by name', () => {
		expect(describeMembers([member('7', 'Ada')])[0]).toMatchObject({
			label: 'Ada',
			unknown: false,
		});
	});

	// alliances.xml and players.xml are generated minutes apart, so a member id
	// can have no player to resolve to; the id is all there is to show.
	it('falls back to the id when the player is unknown', () => {
		const [row] = describeMembers([{ id: '99', name: null, status: null }]);
		expect(row).toMatchObject({ label: '#99', unknown: true });
	});

	it('handles a missing member list', () => {
		expect(describeMembers(undefined)).toEqual([]);
	});
});

describe('safeHomepage', () => {
	it('keeps a plain http(s) link', () => {
		expect(safeHomepage('https://twa.example.com/')).toBe('https://twa.example.com/');
		expect(safeHomepage(' http://twa.example.com ')).toBe('http://twa.example.com/');
	});

	// The homepage is text typed by a third-party player: an executable or
	// app-relative URL must never reach an href.
	it('drops anything that is not http(s)', () => {
		expect(safeHomepage('javascript:alert(1)')).toBeNull();
		expect(safeHomepage('data:text/html,<script>')).toBeNull();
		expect(safeHomepage('/game/index.php')).toBeNull();
		expect(safeHomepage('not a url')).toBeNull();
	});

	it('handles an alliance without a homepage', () => {
		expect(safeHomepage(null)).toBeNull();
		expect(safeHomepage('')).toBeNull();
	});
});

describe('foundYear', () => {
	it('reads the year out of the Unix timestamp', () => {
		expect(foundYear(1592572367)).toBe(2020);
	});

	it('handles a missing date', () => {
		expect(foundYear(null)).toBeNull();
		expect(foundYear(0)).toBeNull();
	});
});
