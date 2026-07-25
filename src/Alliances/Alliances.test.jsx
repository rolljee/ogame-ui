import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor, within } from '../test/utils';
import Alliances from './Alliances';
import { fetchAlliance, fetchUniverses, searchAlliances } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	searchAlliances: vi.fn(),
	fetchAlliance: vi.fn(),
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
	total: 2,
	alliances: [
		{ id: '500006', name: 'The Wolf Army', tag: 'TWA', memberCount: 3, open: true },
		{ id: '500014', name: 'Wolf Pack', tag: 'WP', memberCount: 1, open: false },
	],
};

const ALLIANCE = {
	id: '500006',
	name: 'The Wolf Army',
	tag: 'TWA',
	founder: '1',
	foundDate: 1592572367,
	homepage: 'https://twa.example.com',
	open: true,
	memberCount: 3,
	members: [
		{ id: '1', name: 'Darth Vader', status: status({ active: true }), founder: true },
		{
			id: '2',
			name: 'Anakin',
			status: status({ inactive: true, longInactive: true }),
			founder: false,
		},
		{ id: '99', name: null, status: null, founder: false },
	],
};

async function search(user, term = 'twa') {
	await user.type(screen.getByRole('searchbox'), `${term}{enter}`);
}

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	searchAlliances.mockResolvedValue(RESULTS);
	fetchAlliance.mockResolvedValue(ALLIANCE);
});

describe('<Alliances />', () => {
	it('does not search until a term is submitted', async () => {
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		expect(searchAlliances).not.toHaveBeenCalled();
		expect(screen.getByText(/Search for an alliance/)).toBeInTheDocument();
	});

	it('searches the selected universe', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		await waitFor(() =>
			expect(searchAlliances).toHaveBeenCalledWith(
				{ lang: 'en', universe: '101', search: 'twa' },
				expect.anything(),
			),
		);
	});

	it('lists the matches with their tag and member count', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		expect(await screen.findByText('The Wolf Army')).toBeInTheDocument();
		expect(screen.getByText('[TWA]')).toBeInTheDocument();
		expect(screen.getByText('3 member(s)')).toBeInTheDocument();
		expect(screen.getByText('Showing 2 of 2 matching alliance(s).')).toBeInTheDocument();
	});

	it('loads an alliance and shows its roster', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);

		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		await waitFor(() =>
			expect(fetchAlliance).toHaveBeenCalledWith(
				{ lang: 'en', universe: '101', id: '500006' },
				expect.anything(),
			),
		);
		expect(await screen.findByText('Darth Vader')).toBeInTheDocument();
		expect(screen.getByText('Anakin')).toBeInTheDocument();
		expect(screen.getByText(/founded in 2020/)).toBeInTheDocument();
		expect(screen.getByText(/open to new members/)).toBeInTheDocument();
	});

	it('marks the founder', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		expect(await screen.findByText(/Founder/)).toBeInTheDocument();
	});

	// This is what the Discord bot cannot show: how much of the alliance is alive.
	it('breaks the roster down by status', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		await screen.findByText('Breakdown');
		expect(screen.getByText(/1 Active/)).toBeInTheDocument();
		expect(screen.getByText(/1 Inactive \(28 d\)/)).toBeInTheDocument();
	});

	// The fixture has no member carrying two flags, so the note must stay away.
	it('does not warn about overlapping statuses when there is no overlap', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		await screen.findByText('Breakdown');
		expect(screen.queryByText(/Statuses stack/)).not.toBeInTheDocument();
	});

	// `vi` counts as both, so the chips add up past the roster: say it.
	it('warns when a member carries two statuses at once', async () => {
		const user = userEvent.setup();
		fetchAlliance.mockResolvedValue({
			...ALLIANCE,
			members: [
				ALLIANCE.members[0],
				{ id: '2', name: 'Anakin', status: status({ vacation: true, inactive: true }), founder: false },
				ALLIANCE.members[2],
			],
		});
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		expect(await screen.findByText(/Statuses stack/)).toBeInTheDocument();
	});

	it('filters the members by status, without a new request', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));
		await screen.findByText('Darth Vader');

		const filters = within(screen.getByRole('group', { name: 'Filter members by status' }));
		await user.click(filters.getByRole('button', { name: /Inactive \(28 d\)/ }));

		expect(screen.getByText('Anakin')).toBeInTheDocument();
		expect(screen.queryByText('Darth Vader')).not.toBeInTheDocument();
		expect(fetchAlliance).toHaveBeenCalledTimes(1);
	});

	// A member listed by alliances.xml but absent from players.xml.
	it('keeps a member it could not resolve, labelled by id', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		expect(await screen.findByText('#99')).toBeInTheDocument();
		expect(screen.getByText('Player not found')).toBeInTheDocument();
	});

	it('links the alliance homepage, but only an http(s) one', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		const link = await screen.findByRole('link', { name: 'Alliance homepage' });
		expect(link).toHaveAttribute('href', 'https://twa.example.com/');
	});

	it('does not render a homepage the alliance filled with a script url', async () => {
		const user = userEvent.setup();
		fetchAlliance.mockResolvedValue({ ...ALLIANCE, homepage: 'javascript:alert(1)' });
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		await screen.findByText('Darth Vader');
		expect(screen.queryByRole('link', { name: 'Alliance homepage' })).not.toBeInTheDocument();
	});

	it('forgets the selected alliance when the universe changes', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));
		await screen.findByText('Darth Vader');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');

		expect(await screen.findByText(/Pick an alliance from the list/)).toBeInTheDocument();
	});

	it('reports a failed search', async () => {
		const user = userEvent.setup();
		searchAlliances.mockRejectedValue(new Error('upstream responded 502'));
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user);

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('The search failed');
		expect(alert).toHaveTextContent('upstream responded 502');
	});

	it('reports an alliance that could not be loaded', async () => {
		const user = userEvent.setup();
		fetchAlliance.mockRejectedValue(new Error('unknown alliance: 500006'));
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');
		await search(user);
		await user.click(await screen.findByRole('button', { name: /The Wolf Army/ }));

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('Could not load this alliance');
	});

	it('says so when nothing matches', async () => {
		const user = userEvent.setup();
		searchAlliances.mockResolvedValue({ total: 0, alliances: [] });
		renderWithI18n(<Alliances />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await search(user, 'zzz');

		expect(await screen.findByText('No alliance matches.')).toBeInTheDocument();
	});

	it('renders in French too', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Alliances />, { lang: 'fr' });
		await screen.findByLabelText('Communauté');

		await search(user);

		expect(await screen.findByText('3 membre(s)')).toBeInTheDocument();
	});
});
