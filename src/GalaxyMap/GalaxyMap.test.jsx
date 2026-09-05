import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor, within } from '../test/utils';
import GalaxyMap from './GalaxyMap';
import { fetchRoster, fetchServerData, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchRoster: vi.fn(),
	fetchServerData: vi.fn(),
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

// Two neighbours crowd 1:1, one long-inactive player sits alone in 2:3.
const ROSTER = {
	total: 3,
	coordsTimestamp: Math.round(Date.now() / 1000) - 7200,
	players: [
		{
			id: '1',
			name: 'Élysée',
			alliance: { id: '5', name: 'The Wolf Army', tag: 'TWA' },
			status: status({ active: true }),
			planets: [
				{ coords: '1:1:4', moon: false },
				{ coords: '1:1:8', moon: true },
			],
		},
		{
			id: '2',
			name: 'Elysium',
			alliance: null,
			status: status({ active: true }),
			planets: [{ coords: '1:1:12', moon: false }],
		},
		{
			id: '3',
			name: 'Sleeper',
			alliance: null,
			status: status({ inactive: true, longInactive: true }),
			planets: [{ coords: '2:3:6', moon: false }],
		},
	],
};

const cell = (coords) => screen.getByRole('button', { name: new RegExp(`^${coords} —`) });

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	fetchRoster.mockResolvedValue(ROSTER);
	fetchServerData.mockResolvedValue({ galaxies: 2, systems: 4 });
});

describe('<GalaxyMap />', () => {
	it('draws the whole universe from a single roster request', async () => {
		renderWithI18n(<GalaxyMap />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await waitFor(() =>
			expect(fetchRoster).toHaveBeenCalledWith({ lang: 'en', universe: '101' }, expect.anything()),
		);

		expect(await screen.findByLabelText(/^1:1 — 3 planet\(s\), 2 player\(s\), 1 moon\(s\)/)).toBeInTheDocument();
		expect(screen.getByLabelText(/^2:4 — 0 planet\(s\)/)).toBeInTheDocument();
		expect(screen.getByText('4 placed planet(s) across 2 galaxy(ies) × 4 systems.')).toBeInTheDocument();
	});

	it('shades the busiest system the brightest', async () => {
		renderWithI18n(<GalaxyMap />, { lang: 'en' });
		await screen.findByLabelText(/^1:1 —/);

		expect(cell('1:1')).toHaveClass('gm-level-5');
		expect(cell('2:3')).toHaveClass('gm-level-2');
		expect(cell('1:2')).toHaveClass('gm-level-0');
	});

	it('recolours for inactives without another request', async () => {
		const user = userEvent.setup();
		renderWithI18n(<GalaxyMap />, { lang: 'en' });
		await screen.findByLabelText(/^1:1 —/);

		await user.click(screen.getByRole('button', { name: 'Inactives' }));

		expect(cell('2:3')).toHaveClass('gm-level-5');
		expect(cell('1:1')).toHaveClass('gm-level-0');
		expect(fetchRoster).toHaveBeenCalledTimes(1);
	});

	it('only counts the selected statuses', async () => {
		const user = userEvent.setup();
		renderWithI18n(<GalaxyMap />, { lang: 'en' });
		await screen.findByLabelText(/^1:1 —/);

		await user.click(screen.getByRole('button', { name: /Inactive \(28 d\)/ }));

		expect(cell('1:1')).toHaveClass('gm-level-0');
		expect(screen.getByText('1 placed planet(s) across 2 galaxy(ies) × 4 systems.')).toBeInTheDocument();
	});

	it('lists who lives in a system when its cell is clicked', async () => {
		const user = userEvent.setup();
		renderWithI18n(<GalaxyMap />, { lang: 'en' });
		await screen.findByLabelText(/^1:1 —/);

		await user.click(cell('1:1'));

		expect(screen.getByText('System 1:1')).toBeInTheDocument();
		const rows = within(screen.getByRole('list'));
		expect(rows.getAllByRole('link').map((link) => link.textContent)).toEqual([
			'1:1:4',
			'1:1:8',
			'1:1:12',
		]);
		// Élysée holds two planets there, so she gets two rows.
		expect(rows.getAllByText('Élysée')).toHaveLength(2);
		expect(rows.getAllByText('[TWA]')).toHaveLength(2);
	});

	it('still draws the map when the universe size is unavailable', async () => {
		fetchServerData.mockRejectedValue(new Error('nope'));
		renderWithI18n(<GalaxyMap />, { lang: 'en' });

		expect(await screen.findByLabelText(/^1:1 —/)).toBeInTheDocument();
		expect(screen.getByText('4 placed planet(s) across 2 galaxy(ies) × 3 systems.')).toBeInTheDocument();
	});

	it('reports a roster the proxy could not load', async () => {
		fetchRoster.mockRejectedValue(new Error('upstream 502'));
		renderWithI18n(<GalaxyMap />, { lang: 'en' });

		expect(await screen.findByRole('alert')).toHaveTextContent(
			"Could not load this universe's roster.",
		);
	});
});
