import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderView, screen, userEvent, waitFor } from '../test/utils';
import Combat from './Combat';
import { fetchServerData, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchServerData: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue([{ language: 'fr', number: 172, name: 'Tucana' }]);
	fetchServerData.mockResolvedValue({ name: 'Tucana', number: 172, language: 'fr', debrisFactor: 0.3 });
});

describe('<Combat />', () => {
	it('asks for an attacking fleet first', () => {
		renderView(<Combat />, { lang: 'en' });
		expect(screen.getByText(/Add at least one ship to the attacker/)).toBeInTheDocument();
	});

	it('simulates the battle and reports the averages', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });

		// The attacker grid comes first; the defender has its own Deathstar field.
		await user.type(screen.getAllByLabelText('Deathstar')[0], '5');
		await user.type(screen.getByLabelText('Rocket Launcher'), '200');
		await user.click(screen.getByRole('button', { name: '20' }));
		await user.click(screen.getByRole('button', { name: 'Simulate the battle' }));

		await waitFor(() => expect(screen.getByText('attacker wins')).toBeInTheDocument());
		expect(screen.getByText('100%')).toBeInTheDocument();
		expect(screen.getByText('Average of 20 battles')).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Defender losses' })).toBeInTheDocument();
	});

	it('says when the settings changed since the last run', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });

		// The attacker grid comes first; the defender has its own Deathstar field.
		await user.type(screen.getAllByLabelText('Deathstar')[0], '5');
		await user.type(screen.getByLabelText('Rocket Launcher'), '20');
		await user.click(screen.getByRole('button', { name: '20' }));
		await user.click(screen.getByRole('button', { name: 'Simulate the battle' }));
		await waitFor(() => expect(screen.getByText('attacker wins')).toBeInTheDocument());

		await user.type(screen.getByLabelText('Rocket Launcher'), '0');
		expect(screen.getByText(/The settings changed since this simulation/)).toBeInTheDocument();
	});
});
