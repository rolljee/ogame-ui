import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent, waitFor } from '../test/utils';
import { I18nProvider } from '../i18n/I18nContext';
import { UNIVERSE_STORAGE_KEY, UniverseProvider, UniverseSelect, useUniverse } from './UniverseContext';
import { fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

const UNIVERSES = [
	{ language: 'en', number: 101, name: 'Quantum' },
	{ language: 'fr', number: 172, name: 'Tucana' },
	{ language: 'fr', number: 198, name: 'Andromeda' },
];

function Current() {
	const { selection } = useUniverse();
	return <output>{`${selection.lang}/${selection.universe}`}</output>;
}

function renderShell() {
	localStorage.setItem('og_ui_lang', 'en');
	return render(
		<I18nProvider>
			<UniverseProvider>
				<UniverseSelect />
				<Current />
			</UniverseProvider>
		</I18nProvider>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	localStorage.removeItem(UNIVERSE_STORAGE_KEY);
	fetchUniverses.mockResolvedValue(UNIVERSES);
});

describe('UniverseProvider', () => {
	it('shares the picked universe and remembers it', async () => {
		const user = userEvent.setup();
		renderShell();
		await screen.findByLabelText('Universe');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');
		await user.selectOptions(screen.getByLabelText('Universe'), '198');

		expect(screen.getByRole('status')).toHaveTextContent('fr/198');
		expect(JSON.parse(localStorage.getItem(UNIVERSE_STORAGE_KEY))).toEqual({
			lang: 'fr',
			universe: '198',
		});
	});

	it('comes back on the remembered universe', async () => {
		localStorage.setItem(UNIVERSE_STORAGE_KEY, JSON.stringify({ lang: 'fr', universe: '198' }));
		renderShell();

		expect(await screen.findByLabelText('Universe')).toHaveValue('198');
		expect(screen.getByRole('status')).toHaveTextContent('fr/198');
	});

	it('replaces a remembered universe that has closed since', async () => {
		localStorage.setItem(UNIVERSE_STORAGE_KEY, JSON.stringify({ lang: 'fr', universe: '999' }));
		renderShell();

		await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('fr/172'));
	});

	it('ignores an unreadable stored value', async () => {
		localStorage.setItem(UNIVERSE_STORAGE_KEY, '{not json');
		renderShell();

		await waitFor(() => expect(screen.getByRole('status')).not.toHaveTextContent(/^\/$/));
	});
});
