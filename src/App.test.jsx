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
		expect(screen.getByText('Resource exchange calculator')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'FR' }));

		expect(screen.getByText("Calculateur d'échange de ressources")).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Deutérium' })).toBeInTheDocument();
	});
});
