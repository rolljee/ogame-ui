import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor, within } from '../test/utils';
import Players from './Players';
import { fetchPlayer, fetchUniverses, searchPlayers } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	searchPlayers: vi.fn(),
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

const RESULTS = {
	total: 3,
	players: [
		{ id: '100010', name: 'Élysée', alliance: '5', status: status({ active: true }) },
		{ id: '100011', name: 'Elysium', alliance: null, status: status({ vacation: true }) },
		{
			id: '100012',
			name: 'Elyx',
			alliance: null,
			status: status({ inactive: true, longInactive: true }),
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

// Submitting with Enter keeps the helper language-agnostic; the button itself
// is exercised in its own test below.
async function search(user, term = 'elysee') {
	await user.type(screen.getByRole('searchbox'), `${term}{enter}`);
}

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	searchPlayers.mockResolvedValue(RESULTS);
	fetchPlayer.mockResolvedValue(PLAYER);
});

describe('<Players />', () => {
	it('does not search until a term is submitted', async () => {
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		expect(searchPlayers).not.toHaveBeenCalled();
		expect(screen.getByText(/Search for a player/)).toBeInTheDocument();
	});

	it('searches the selected universe', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		await waitFor(() =>
			expect(searchPlayers).toHaveBeenCalledWith(
				{ lang: 'en', universe: '101', search: 'elysee' },
				expect.anything(),
			),
		);
	});

	it('searches from the button too', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await user.type(screen.getByLabelText(/Name/), 'elysee');
		await user.click(screen.getByRole('button', { name: 'Search' }));

		await waitFor(() => expect(searchPlayers).toHaveBeenCalled());
	});

	it('lists the matches with their status badges', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		expect(await screen.findByText('Élysée')).toBeInTheDocument();
		expect(screen.getByText('Showing 3 of 3 matching player(s).')).toBeInTheDocument();

		const rows = within(screen.getByRole('list'));
		expect(rows.getByText(/Vacation/)).toBeInTheDocument();
		// Both `i` and `I` are set, but only the 28-day badge is shown.
		expect(rows.getByText(/Inactive \(28 d\)/)).toBeInTheDocument();
		expect(rows.queryByText(/Inactive \(7 d\)/)).not.toBeInTheDocument();
	});

	it('filters the results by status, without a new request', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await screen.findByText('Élysée');

		const filters = within(screen.getByRole('group', { name: 'Filter by status' }));
		await user.click(filters.getByRole('button', { name: /Vacation/ }));

		expect(screen.getByText('Elysium')).toBeInTheDocument();
		expect(screen.queryByText('Élysée')).not.toBeInTheDocument();
		expect(searchPlayers).toHaveBeenCalledTimes(1);
	});

	it('loads a player and shows their scores and planets', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);

		await user.click(await screen.findByRole('button', { name: /Élysée/ }));

		await waitFor(() =>
			expect(fetchPlayer).toHaveBeenCalledWith(
				{ lang: 'en', universe: '101', id: '100010' },
				expect.anything(),
			),
		);
		expect(await screen.findByText('1.403.837')).toBeInTheDocument();
		expect(screen.getByText('Overall')).toBeInTheDocument();
		expect(screen.getByText('2 planet(s) · 1 moon(s)')).toBeInTheDocument();
		expect(screen.getByText('Colonie')).toBeInTheDocument();
		expect(screen.getByText(/Lune/)).toHaveTextContent('8.944 km');
	});

	it('links every coordinate into the galaxy view of the universe', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /Élysée/ }));

		const link = await screen.findByRole('link', { name: '[4:212:8]' });
		expect(link).toHaveAttribute(
			'href',
			'https://s101-en.ogame.gameforge.com/game/index.php' +
				'?page=ingame&component=galaxy&galaxy=4&system=212&position=8',
		);
	});

	it('drops the score categories Gameforge does not document', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /Élysée/ }));

		await screen.findByText('Overall');
		expect(screen.queryByText('42')).not.toBeInTheDocument();
	});

	it('forgets the selected player when the universe changes', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /Élysée/ }));
		await screen.findByText('Overall');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');

		expect(await screen.findByText(/Pick a player from the list/)).toBeInTheDocument();
	});

	it('reports a failed search', async () => {
		const user = userEvent.setup();
		searchPlayers.mockRejectedValue(new Error('upstream responded 502'));
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('The search failed');
		expect(alert).toHaveTextContent('upstream responded 502');
	});

	it('says so when nothing matches', async () => {
		const user = userEvent.setup();
		searchPlayers.mockResolvedValue({ total: 0, players: [] });
		renderWithI18n(<Players />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user, 'zzz');

		expect(await screen.findByText('No player matches.')).toBeInTheDocument();
	});

	it('renders in French too', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Players />, { lang: 'fr' });
		await screen.findByLabelText('Communauté');

		await search(user, 'elysee');

		expect(await within(screen.getByRole('list')).findByText(/Vacances/)).toBeInTheDocument();
	});
});
