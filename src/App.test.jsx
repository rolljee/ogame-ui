import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithI18n, screen, userEvent } from './test/utils';
import App from './App';

vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));

describe('<App />', () => {
	it('renders the shell and the calculator', () => {
		renderWithI18n(<App />);
		expect(screen.getByText('OGame Tools')).toBeInTheDocument();
		expect(screen.getByRole('main')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Deuterium' })).toBeInTheDocument();
	});

	it('marks the current language in the toggle', () => {
		renderWithI18n(<App />, { lang: 'en' });
		expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'FR' })).toHaveAttribute('aria-pressed', 'false');
	});

	it('translates the whole page when the language changes', async () => {
		const user = userEvent.setup();
		renderWithI18n(<App />, { lang: 'en' });
		expect(screen.getByText('Calculators for OGame')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'FR' }));

		expect(screen.getByText('Outils de calcul pour OGame')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Deutérium' })).toBeInTheDocument();
	});

	it('opens on the trade calculator', () => {
		renderWithI18n(<App />);
		expect(screen.getByRole('button', { name: 'Trade' })).toHaveAttribute('aria-current', 'page');
	});

	it('switches to the moonbreak tool', async () => {
		const user = userEvent.setup();
		renderWithI18n(<App />);

		await user.click(screen.getByRole('button', { name: 'Moonbreak' }));

		expect(screen.getByText('Moon size')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Deuterium' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Moonbreak' })).toHaveAttribute(
			'aria-current',
			'page',
		);
	});

	it('switches to the server settings tool', async () => {
		const user = userEvent.setup();
		renderWithI18n(<App />);

		await user.click(screen.getByRole('button', { name: 'Server settings' }));

		expect(screen.getByText('Pick a universe')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Server settings' })).toHaveAttribute(
			'aria-current',
			'page',
		);
	});

	it('switches to the alliances tool', async () => {
		const user = userEvent.setup();
		renderWithI18n(<App />);

		await user.click(screen.getByRole('button', { name: 'Alliances' }));

		expect(screen.getByText('Find an alliance')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Alliances' })).toHaveAttribute(
			'aria-current',
			'page',
		);
	});

	it('links to the support page in a new tab', () => {
		renderWithI18n(<App />);

		const link = screen.getByRole('link', { name: /Buy me a coffee/ });
		expect(link).toHaveAttribute('href', 'https://buymeacoffee.com/rolljee');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('comes back to the trade calculator', async () => {
		const user = userEvent.setup();
		renderWithI18n(<App />);

		await user.click(screen.getByRole('button', { name: 'Moonbreak' }));
		await user.click(screen.getByRole('button', { name: 'Trade' }));

		expect(screen.getByRole('button', { name: 'Deuterium' })).toBeInTheDocument();
	});
});
