import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor } from '../test/utils';
import Expeditions from './Expeditions';
import { fetchServerData, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchServerData: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

const UNIVERSES = [
	{ language: 'en', number: 101, name: 'Quantum' },
	{ language: 'fr', number: 172, name: 'Tucana' },
];

const TUCANA = {
	name: 'Tucana',
	number: 172,
	language: 'fr',
	speed: 10,
	topScore: 1403837599722,
	cargoHyperspaceTechMultiplier: 5,
};

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	fetchServerData.mockResolvedValue(TUCANA);
});

describe('<Expeditions />', () => {
	it('asks for a hyperspace level before computing anything', async () => {
		renderWithI18n(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		expect(screen.getByText(/Enter your hyperspace level/)).toBeInTheDocument();
	});

	it('shows the maximum find and the ships needed to carry it', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		expect(await screen.findByText('150.000.000')).toBeInTheDocument();
		expect(screen.getByText('4.000')).toBeInTheDocument();
		expect(screen.getByText('Large Cargos')).toBeInTheDocument();
		expect(screen.getByText('20.000')).toBeInTheDocument();
		expect(screen.getByText('Small Cargos')).toBeInTheDocument();
	});

	it('halves the find when the Pathfinder is taken out of the fleet', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.click(screen.getByRole('checkbox'));

		expect(await screen.findByText('75.000.000')).toBeInTheDocument();
	});

	it('recomputes when another universe is picked', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Expeditions />, { lang: 'fr' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperespace/), '10');

		fetchServerData.mockResolvedValue({ ...TUCANA, name: 'Quantum', number: 101, speed: 1 });
		await user.selectOptions(screen.getByLabelText('Communauté'), 'en');

		expect(await screen.findByText('15.000.000')).toBeInTheDocument();
	});

	it('reports a failure to load the universe settings', async () => {
		fetchServerData.mockRejectedValue(new Error('upstream responded 503'));
		renderWithI18n(<Expeditions />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('upstream responded 503');
	});
});
