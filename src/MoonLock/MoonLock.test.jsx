import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor } from '../test/utils';
import MoonLock from './MoonLock';
import { fetchServerData, fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	fetchServerData: vi.fn(),
	ApiError: class ApiError extends Error {},
}));
vi.mock('copy-to-clipboard', () => ({ default: vi.fn() }));

const UNIVERSES = [
	{ language: 'en', number: 101, name: 'Quantum' },
	{ language: 'fr', number: 172, name: 'Tucana' },
];

const TUCANA = {
	name: 'Tucana',
	number: 172,
	language: 'fr',
	galaxies: 7,
	systems: 499,
	debrisFactor: 0.5,
};

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
	fetchServerData.mockResolvedValue(TUCANA);
});

describe('<MoonLock />', () => {
	it('asks for coordinates before computing anything', async () => {
		renderWithI18n(<MoonLock />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		expect(screen.getByText(/Enter valid coordinates/)).toBeInTheDocument();
	});

	it('shows the ships to blow up and links to the galaxy view', async () => {
		const user = userEvent.setup();
		renderWithI18n(<MoonLock />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		await user.type(screen.getByLabelText(/Position/), '4:212:8');

		const link = await screen.findByRole('link', { name: '4:212:8' });
		expect(link).toHaveAttribute(
			'href',
			'https://s172-fr.ogame.gameforge.com/game/index.php' +
				'?page=ingame&component=galaxy&galaxy=4&system=212&position=8',
		);
		expect(screen.getByText('1.000')).toBeInTheDocument();
		expect(screen.getByText('Light Fighter')).toBeInTheDocument();
		expect(screen.getByText('4.000')).toBeInTheDocument();
		expect(screen.getByText('Espionage Probe')).toBeInTheDocument();
	});

	it('names the ships in the interface language', async () => {
		const user = userEvent.setup();
		renderWithI18n(<MoonLock />, { lang: 'fr' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		await user.type(screen.getByLabelText(/Position/), '4:212:8');

		expect(await screen.findByText('Chasseur léger')).toBeInTheDocument();
		expect(screen.getByText("Sonde d'espionnage")).toBeInTheDocument();
	});

	it('needs fewer ships in a universe with more debris', async () => {
		const user = userEvent.setup();
		fetchServerData.mockResolvedValue({ ...TUCANA, debrisFactor: 1 });
		renderWithI18n(<MoonLock />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		await user.type(screen.getByLabelText(/Position/), '4:212:8');

		expect(await screen.findByText('500')).toBeInTheDocument();
		expect(screen.getByText('Ship debris: 100%')).toBeInTheDocument();
	});

	it('copies the link', async () => {
		const user = userEvent.setup();
		const copy = (await import('copy-to-clipboard')).default;
		renderWithI18n(<MoonLock />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());
		await user.type(screen.getByLabelText(/Position/), '4:212:8');

		await user.click(screen.getByRole('button', { name: 'Copy the link' }));

		expect(copy).toHaveBeenCalledWith(expect.stringContaining('galaxy=4&system=212&position=8'));
	});

	it('rejects coordinates the universe cannot hold', async () => {
		const user = userEvent.setup();
		renderWithI18n(<MoonLock />, { lang: 'en' });
		await waitFor(() => expect(fetchServerData).toHaveBeenCalled());

		await user.type(screen.getByLabelText(/Position/), '9:1:1');

		expect(screen.getByText(/Enter valid coordinates/)).toBeInTheDocument();
	});

	it('reports a failure to load the universe settings', async () => {
		fetchServerData.mockRejectedValue(new Error('upstream responded 503'));
		renderWithI18n(<MoonLock />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('upstream responded 503');
	});
});
