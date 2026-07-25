import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor, within } from '../test/utils';
import Players from './Players';
import { fetchPlayer, fetchRoster, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchRoster: vi.fn(),
	fetchPlayer: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

const UNIVERSES = [
	{ language: 'en', number: 101, name: 'Quantum' },
	{ language: 'fr', number: 172, name: 'Tucana' },
];

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

// Élysée straddles two galaxies, Elysium shares a system with her, Elyx sits
// elsewhere, and Newcomer has no coordinates — the galaxy dump lags by days.
const ROSTER = {
	total: 4,
	coordsTimestamp: Math.round(Date.now() / 1000) - 7200,
	players: [
		{
			id: '100010',
			name: 'Élysée',
			alliance: { id: '5', name: 'The Wolf Army', tag: 'TWA' },
			status: status({ active: true }),
			planets: [
				{ coords: '1:1:1', moon: false },
				{ coords: '4:212:8', moon: true },
			],
		},
		{
			id: '100011',
			name: 'Elysium',
			alliance: null,
			status: status({ vacation: true }),
			planets: [{ coords: '4:212:9', moon: false }],
		},
		{
			id: '100012',
			name: 'Elyx',
			alliance: null,
			status: status({ inactive: true, longInactive: true }),
			planets: [{ coords: '2:194:8', moon: false }],
		},
		{
			id: '100013',
			name: 'Newcomer',
			alliance: null,
			status: status({ active: true }),
			planets: [],
		},
	],
};

const PLAYER = {
	id: '100010',
	name: 'Élysée',
	scores: [
		{ type: 0, key: 'total', score: 1403837, rank: 12 },
		{ type: 1, key: 'economy', score: 900000, rank: 8 },
		{ type: 9, key: null, score: 42, rank: 3 },
	],
	planets: [
		{
			id: '33',
			name: 'Colonie',
			coords: '4:212:8',
			moon: { id: '44', name: 'Lune', size: 8944 },
		},
		{ id: '34', name: 'Planète mère', coords: '1:1:1', moon: null },
	],
};

const rows = () => within(screen.getByRole('list'));

// Row order matters to the sort tests, so read the names off the DOM in order.
const names = () =>
	[...screen.getByRole('list').querySelectorAll('.pl-row-name')].map(
		(node) => node.textContent,
	);

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	fetchRoster.mockResolvedValue(ROSTER);
	fetchPlayer.mockResolvedValue(PLAYER);
});

describe('<Players />', () => {
	// The whole point of the roster: the list is there before anything is typed.
	it('loads the whole universe as soon as one is picked', async () => {
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await waitFor(() =>
			expect(fetchRoster).toHaveBeenCalledWith({ lang: 'en', universe: '101' }, expect.anything()),
		);
		expect(await screen.findByText('Élysée')).toBeInTheDocument();
		expect(screen.getByText('4 of the 4 players in the universe.')).toBeInTheDocument();
	});

	it('filters by name as you type, without a request', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByRole('searchbox'), 'elysee');

		expect(names()).toEqual(['Élysée[TWA]']);
		expect(fetchRoster).toHaveBeenCalledTimes(1);
	});

	it('filters by galaxy', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByLabelText(/Galaxy/), '4');

		expect(names()).toEqual(['Élysée[TWA]', 'Elysium']);
	});

	it('filters by system', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByLabelText(/System/), '194');

		expect(names()).toEqual(['Elyx']);
	});

	it('combines a galaxy with a status filter', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByLabelText(/Galaxy/), '4');
		const filters = within(screen.getByRole('group', { name: 'Filter by status' }));
		await user.click(filters.getByRole('button', { name: /Vacation/ }));

		expect(names()).toEqual(['Elysium']);
	});

	// Only the positions that matched are worth showing on a row.
	it('shows the coordinates that matched, linked into the galaxy view', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByLabelText(/Galaxy/), '4');

		const link = rows().getByRole('link', { name: /4:212:8/ });
		expect(link).toHaveAttribute(
			'href',
			'https://s101-en.ogame.gameforge.com/game/index.php' +
				'?page=ingame&component=galaxy&galaxy=4&system=212&position=8',
		);
		expect(rows().queryByRole('link', { name: /1:1:1/ })).not.toBeInTheDocument();
	});

	it('sorts by position on request, and by name by default', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');
		expect(names()).toEqual(['Élysée[TWA]', 'Elysium', 'Elyx', 'Newcomer']);

		const sort = within(screen.getByRole('group', { name: 'Sort by' }));
		await user.click(sort.getByRole('button', { name: 'Position' }));

		// 1:1:1, then 2:194:8, then 4:212:9, and no coordinates last.
		expect(names()).toEqual(['Élysée[TWA]', 'Elyx', 'Elysium', 'Newcomer']);
	});

	it('keeps a player without coordinates until a position is asked for', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Newcomer');

		await user.type(screen.getByLabelText(/Galaxy/), '1');

		expect(names()).not.toContain('Newcomer');
	});

	// The galaxy dump is days old; the view has to say so.
	it('says how old the positions are', async () => {
		renderWithI18n(<Players />, { lang: 'en' });
		expect(await screen.findByText(/galaxy dump, 2 h old/)).toBeInTheDocument();
	});

	it('shows the alliance tag of each player', async () => {
		renderWithI18n(<Players />, { lang: 'en' });
		expect(await screen.findByText('[TWA]')).toHaveAttribute('title', 'The Wolf Army');
	});

	it('badges the statuses, keeping only the longer inactivity', async () => {
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		expect(rows().getByText(/Vacation/)).toBeInTheDocument();
		expect(rows().getByText(/Inactive \(28 d\)/)).toBeInTheDocument();
		expect(rows().queryByText(/Inactive \(7 d\)/)).not.toBeInTheDocument();
	});

	it('loads a player and shows their scores and planets', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });

		await user.click(await screen.findByRole('button', { name: /Élysée/ }));

		await waitFor(() =>
			expect(fetchPlayer).toHaveBeenCalledWith(
				{ lang: 'en', universe: '101', id: '100010' },
				expect.anything(),
			),
		);
		expect(await screen.findByText('1.403.837')).toBeInTheDocument();
		expect(screen.getByText('2 planet(s) · 1 moon(s)')).toBeInTheDocument();
		expect(screen.getByText('Colonie')).toBeInTheDocument();
	});

	it('drops the score categories Gameforge does not document', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await user.click(await screen.findByRole('button', { name: /Élysée/ }));

		await screen.findByText('Overall');
		expect(screen.queryByText('42')).not.toBeInTheDocument();
	});

	it('forgets the selected player when the universe changes', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await user.click(await screen.findByRole('button', { name: /Élysée/ }));
		await screen.findByText('Overall');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');

		expect(await screen.findByText(/Pick a player from the list/)).toBeInTheDocument();
	});

	it('reports a roster that could not be loaded', async () => {
		fetchRoster.mockRejectedValue(new Error('upstream responded 502'));
		renderWithI18n(<Players />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent("Could not load this universe's roster");
		expect(alert).toHaveTextContent('upstream responded 502');
	});

	it('says so when nothing matches the filters', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByText('Élysée');

		await user.type(screen.getByRole('searchbox'), 'zzz');

		expect(screen.getByText('No player matches.')).toBeInTheDocument();
	});

	it('renders in French too', async () => {
		renderWithI18n(<Players />, { lang: 'fr' });
		await screen.findByText('Élysée');

		expect(rows().getByText(/Vacances/)).toBeInTheDocument();
		expect(screen.getByLabelText(/Galaxie/)).toBeInTheDocument();
	});
});
