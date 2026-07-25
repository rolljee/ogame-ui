import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor } from '../test/utils';
import ServerSettings from './ServerSettings';
import { fetchServerData, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchServerData: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

const UNIVERSES = [
	{ language: 'de', number: 100, name: 'Alpha', settings: {} },
	{ language: 'en', number: 101, name: 'Quantum', settings: {} },
	{ language: 'fr', number: 172, name: 'Tucana', settings: {} },
	{ language: 'fr', number: 198, name: 'Thuban', settings: {} },
];

const TUCANA = {
	name: 'Tucana',
	number: 172,
	language: 'fr',
	version: '13.0.0-r5',
	speed: 10,
	speedFleetWar: 3,
	researchDurationDivisor: 2,
	galaxies: 7,
	debrisFactor: 0.5,
	acs: 1,
	probeCargo: 0,
	topScore: 1403837599722.3,
	marketplaceBasicTradeRatioMetal: 2.5,
	marketplaceBasicTradeRatioCrystal: 1.5,
	marketplaceBasicTradeRatioDeuterium: 1,
};

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	fetchServerData.mockResolvedValue(TUCANA);
});

describe('<ServerSettings />', () => {
	it('offers the communities returned by the API', async () => {
		renderWithI18n(<ServerSettings />);
		const community = await screen.findByLabelText('Community');
		expect([...community.options].map((o) => o.value)).toEqual(['de', 'en', 'fr']);
	});

	it('preselects the interface language and loads its first universe', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		expect(fetchServerData).toHaveBeenCalledWith(
			{ lang: 'en', universe: '101' },
			expect.anything(),
		);
	});

	it('falls back to the first community when the interface language has none', async () => {
		fetchUniverses.mockResolvedValue([{ language: 'de', number: 100, name: 'Alpha' }]);
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		expect(fetchServerData).toHaveBeenCalledWith(
			{ lang: 'de', universe: '100' },
			expect.anything(),
		);
	});

	it('lists only the universes of the selected community', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'fr' });
		const universe = await screen.findByLabelText('Univers');
		await waitFor(() => expect(universe.options).toHaveLength(2));
		expect([...universe.options].map((o) => o.textContent)).toEqual([
			'172 — Tucana',
			'198 — Thuban',
		]);
	});

	it('switches to the first universe of a newly picked community', async () => {
		const user = userEvent.setup();
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');

		await waitFor(() =>
			expect(fetchServerData).toHaveBeenLastCalledWith(
				{ lang: 'fr', universe: '172' },
				expect.anything(),
			),
		);
	});

	it('reloads when another universe is picked', async () => {
		const user = userEvent.setup();
		renderWithI18n(<ServerSettings />, { lang: 'fr' });
		await screen.findByLabelText('Univers');

		await user.selectOptions(screen.getByLabelText('Univers'), '198');

		await waitFor(() =>
			expect(fetchServerData).toHaveBeenLastCalledWith(
				{ lang: 'fr', universe: '198' },
				expect.anything(),
			),
		);
	});

	it('renders the settings, grouped and formatted', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'en' });

		expect(await screen.findByText('Speeds')).toBeInTheDocument();
		expect(screen.getByText('Combat and debris')).toBeInTheDocument();
		expect(screen.getByText('×10')).toBeInTheDocument();
		expect(screen.getByText('÷2')).toBeInTheDocument();
		expect(screen.getByText('50 %')).toBeInTheDocument();
		expect(screen.getByText('1.403.837.599.722')).toBeInTheDocument();
	});

	it('shows the official exchange rate, ready for the trade calculator', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		expect(await screen.findByText('2.5 : 1.5 : 1')).toBeInTheDocument();
	});

	it('translates booleans instead of showing 1 and 0', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		expect(await screen.findByText('Yes')).toBeInTheDocument();
		expect(screen.getByText('No')).toBeInTheDocument();
	});

	// s1-en omits <name> entirely, which used to render an empty heading.
	it('names a universe that does not report a name', async () => {
		fetchServerData.mockResolvedValue({ number: 1, language: 'en', speed: 8 });
		renderWithI18n(<ServerSettings />, { lang: 'en' });
		expect(await screen.findByRole('heading', { name: 'Universe 1' })).toBeInTheDocument();
	});

	it('reports a failure to load the universe list', async () => {
		fetchUniverses.mockRejectedValue(new Error('cannot reach the API'));
		renderWithI18n(<ServerSettings />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('Could not load the universe list');
		expect(alert).toHaveTextContent('cannot reach the API');
	});

	it('reports a failure to load the settings', async () => {
		fetchServerData.mockRejectedValue(new Error('upstream responded 503'));
		renderWithI18n(<ServerSettings />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('Could not load this universe');
		expect(alert).toHaveTextContent('upstream responded 503');
	});

	it('renders in French too', async () => {
		renderWithI18n(<ServerSettings />, { lang: 'fr' });
		expect(await screen.findByText('Vitesses')).toBeInTheDocument();
		expect(screen.getByText('Combat et débris')).toBeInTheDocument();
	});
});
