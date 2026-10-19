import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderView, screen, userEvent, waitFor } from '../test/utils';
import Combat, { COMBAT_STORAGE_KEY } from './Combat';
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

async function fillBattle(user) {
	await user.click(screen.getByRole('button', { name: '20' }));
	await user.type(screen.getByLabelText('Deathstar Attacker'), '5');
	await user.type(screen.getByLabelText('Rocket Launcher'), '200');
	await waitFor(() => expect(screen.getByText('attacker wins')).toBeInTheDocument());
}

describe('<Combat />', () => {
	it('asks for an attacking fleet first', () => {
		renderView(<Combat />, { lang: 'en' });
		expect(screen.getByText(/Add at least one ship to the attacker/)).toBeInTheDocument();
	});

	it('simulates the battle on its own once both sides are filled', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });
		await fillBattle(user);

		expect(screen.getByText('100%')).toBeInTheDocument();
		expect(screen.getByText('Average of 20 battles')).toBeInTheDocument();
		const units = screen.getByRole('table', { name: 'Units lost (average)' });
		expect(units).toHaveTextContent('Rocket Launcher');
		expect(units).toHaveTextContent('−200 / 200');
	});

	it('expands the k and m shorthands as they are typed', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });
		await user.type(screen.getByRole('textbox', { name: 'Metal' }), '5k');
		expect(screen.getByRole('textbox', { name: 'Metal' })).toHaveValue('5.000');
	});

	it('sends the survivors in a next wave', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });
		await user.type(screen.getByRole('textbox', { name: 'Metal' }), '1000');
		await fillBattle(user);

		await user.click(screen.getByRole('button', { name: 'Next wave' }));
		expect(screen.getByLabelText('Deathstar Attacker')).toHaveValue('5');
		expect(Number(screen.getByLabelText('Rocket Launcher').value.replace(/\D/g, ''))).toBeGreaterThan(100);
		expect(screen.getByRole('textbox', { name: 'Metal' })).toHaveValue('500');
	});

	it('clears one side without touching the other', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });

		await user.type(screen.getByLabelText('Deathstar Attacker'), '5');
		await user.type(screen.getByLabelText('Deathstar Defender'), '3');
		await user.click(screen.getByRole('button', { name: 'Clear the attacker' }));

		expect(screen.getByLabelText('Deathstar Attacker')).toHaveValue('');
		expect(screen.getByLabelText('Deathstar Defender')).toHaveValue('3');
	});

	it('remembers the form across visits', async () => {
		const user = userEvent.setup();
		const { unmount } = renderView(<Combat />, { lang: 'en' });
		await user.type(screen.getByLabelText('Deathstar Attacker'), '5');
		expect(Object.values(JSON.parse(localStorage.getItem(COMBAT_STORAGE_KEY)).attacker.ships)).toEqual(['5']);
		unmount();

		renderView(<Combat />, { lang: 'en' });
		expect(screen.getByLabelText('Deathstar Attacker')).toHaveValue('5');
	});

	it('gives no field where a side cannot have the unit', () => {
		renderView(<Combat />, { lang: 'en' });
		expect(screen.getByLabelText('Solar Satellite Defender')).toBeInTheDocument();
		expect(screen.queryByLabelText('Solar Satellite Attacker')).not.toBeInTheDocument();
		expect(screen.queryByLabelText('Hyperspace Defender')).not.toBeInTheDocument();
	});
});

describe('<Combat /> espionage report', () => {
	it('fills the defender from a pasted report', async () => {
		const user = userEvent.setup();
		renderView(<Combat />, { lang: 'en' });

		await user.type(screen.getByLabelText('Weapons Defender'), '12');
		await user.click(screen.getByRole('button', { name: 'Paste an espionage report' }));
		const field = screen.getByLabelText('Espionage report');
		await user.click(field);
		await user.paste('Metal: 1.5M\nDeathstar 3\nRocket Launcher 2.000');
		expect(screen.getByText('Found — ships: 1 · defenses: 1 · technologies: 0 · resources: 1')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Fill the defender' }));
		expect(screen.getByLabelText('Deathstar Defender')).toHaveValue('3');
		expect(screen.getByLabelText('Rocket Launcher')).toHaveValue('2.000');
		expect(screen.getByRole('textbox', { name: 'Metal' })).toHaveValue('1.500.000');
		expect(screen.getByLabelText('Weapons Defender')).toHaveValue('12');
		expect(screen.getByText(/No technologies in the report/)).toBeInTheDocument();
	});
});
