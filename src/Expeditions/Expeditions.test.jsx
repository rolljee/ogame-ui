import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderView, screen, userEvent, waitFor } from '../test/utils';
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
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		expect(screen.getByText(/Enter your hyperspace level/)).toBeInTheDocument();
	});

	it('shows the maximum find and the ships needed to carry it', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
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
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.click(screen.getByRole('checkbox'));

		expect(await screen.findByText('75.000.000')).toBeInTheDocument();
	});

	it('recomputes when another universe is picked', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'fr' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperespace/), '10');

		fetchServerData.mockResolvedValue({ ...TUCANA, name: 'Quantum', number: 101, speed: 1 });
		await user.selectOptions(screen.getByLabelText('Communauté'), 'en');

		expect(await screen.findByText('15.000.000')).toBeInTheDocument();
	});

	it('drops the economy speed and the class bonus for another class', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.click(screen.getByRole('button', { name: 'General' }));

		expect(await screen.findByText('10.000.000')).toBeInTheDocument();
		expect(screen.getByText('267')).toBeInTheDocument();
	});

	it('gives the Collector more cargo per ship', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.click(screen.getByRole('button', { name: 'Collector' }));

		// 25 000 × (1 + 50 % hyperspace + 25 % class)
		expect(await screen.findByText('43.750 cargo each')).toBeInTheDocument();
	});

	it('applies the lifeform bonuses typed in', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.type(screen.getByLabelText('Discoverer class bonus'), '20');
		// 5 M × (1 + 50 % × 1.2) × 10 × 2
		expect(await screen.findByText('160.000.000')).toBeInTheDocument();

		await user.type(screen.getByLabelText('Expedition resources found'), '10');
		expect(await screen.findByText('176.000.000')).toBeInTheDocument();
		expect(screen.getByText(/Computed for: Discoverer · class \+20 % · resources \+10 %/)).toBeInTheDocument();
	});

	it('only asks a Discoverer for the Discoverer enhancement', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		expect(screen.getByLabelText('Discoverer class bonus')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Collector' }));
		expect(screen.queryByLabelText('Discoverer class bonus')).not.toBeInTheDocument();
	});

	it('lists the other expedition bonuses for information', async () => {
		const user = userEvent.setup();
		renderView(<Expeditions />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Hyperspace/), '10');

		await user.click(screen.getByText('Other expedition bonuses'));
		await user.type(screen.getByLabelText('Dark Matter found'), '3,5');

		expect(await screen.findByText('Dark Matter found: +3.5 %')).toBeInTheDocument();
		// Information only: the find does not move.
		expect(screen.getByText('150.000.000')).toBeInTheDocument();
	});

	it('reports a failure to load the universe settings', async () => {
		fetchServerData.mockRejectedValue(new Error('upstream responded 503'));
		renderView(<Expeditions />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('upstream responded 503');
	});
});
