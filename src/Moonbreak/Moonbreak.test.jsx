import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../test/utils';
import Moonbreak from './Moonbreak';

describe('<Moonbreak />', () => {
	it('asks for a fleet before showing anything', () => {
		renderWithI18n(<Moonbreak />);
		expect(screen.getByText(/Enter each attacker's Deathstar count/)).toBeInTheDocument();
	});

	it('computes the probability once a fleet is entered', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);

		await user.type(screen.getByLabelText('Attacker 1'), '100');

		// Default moon size is the 8944 km maximum.
		expect(screen.getByText('77.75%')).toBeInTheDocument();
		expect(screen.getByText('4 wave(s) of 17 and 2 wave(s) of 16 Deathstars.')).toBeInTheDocument();
	});

	it('reacts to the moon size', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);
		// The percentage lives next to its caption, which the bands also match.
		const readProbability = () =>
			screen.getByText('chance to break the moon').closest('p').textContent;

		await user.type(screen.getByLabelText('Attacker 1'), '50');
		const before = readProbability();

		const size = screen.getByRole('textbox', { name: /Size/ });
		await user.clear(size);
		await user.type(size, '5000');

		expect(readProbability()).not.toBe(before);
	});

	it('rejects a moon size outside the in-game range', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);

		await user.type(screen.getByLabelText('Attacker 1'), '100');
		const size = screen.getByRole('textbox', { name: /Size/ });
		await user.clear(size);
		await user.type(size, '1000');

		expect(screen.getByText(/Enter a valid moon size/)).toBeInTheDocument();
	});

	it('adds and removes attackers, up to four', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);

		const add = () => screen.getByRole('button', { name: '+ Add an attacker' });
		await user.click(add());
		await user.click(add());
		await user.click(add());

		expect(screen.getByLabelText('Attacker 4')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: '+ Add an attacker' })).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Remove attacker 4' }));
		expect(screen.queryByLabelText('Attacker 4')).not.toBeInTheDocument();
	});

	it('has no remove button when a single attacker is left', () => {
		renderWithI18n(<Moonbreak />);
		expect(screen.queryByRole('button', { name: /Remove attacker/ })).not.toBeInTheDocument();
	});

	it('labels each attacker in the wave plan when several attack', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);

		await user.type(screen.getByLabelText('Attacker 1'), '100');
		await user.click(screen.getByRole('button', { name: '+ Add an attacker' }));
		await user.type(screen.getByLabelText('Attacker 2'), '80');

		expect(screen.getByText('94.09%')).toBeInTheDocument();
		expect(screen.getByText(/Attacker 1 · 100 RIP/)).toBeInTheDocument();
		expect(screen.getByText(/Attacker 2 · 80 RIP/)).toBeInTheDocument();
	});

	it('shows the three confidence bands and the average losses', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Moonbreak />);

		await user.type(screen.getByLabelText('Attacker 1'), '100');

		expect(screen.getByText('68%')).toBeInTheDocument();
		expect(screen.getByText('95%')).toBeInTheDocument();
		expect(screen.getByText('99%')).toBeInTheDocument();
		expect(
			screen.getByText('chance to lose between 23.33 and 31.98 Deathstars'),
		).toBeInTheDocument();
		expect(screen.getByText('27.66')).toBeInTheDocument();
	});

	it('renders in French too', () => {
		renderWithI18n(<Moonbreak />, { lang: 'fr' });
		expect(screen.getByText('Taille de la lune')).toBeInTheDocument();
		expect(screen.getByLabelText('Attaquant 1')).toBeInTheDocument();
	});
});
