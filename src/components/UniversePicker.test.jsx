import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent, waitFor } from '../test/utils';
import UniversePicker, { DEFAULT_UNIVERSE } from './UniversePicker';
import { fetchUniverses } from '../api/ogame';

vi.mock('../api/ogame', () => ({
	fetchUniverses: vi.fn(),
	ApiError: class ApiError extends Error {},
}));

const universe = (language, number, name) => ({ language, number, name, settings: {} });

// The default universe is deliberately not first in its community, so a test
// that passes cannot be passing by accident.
const UNIVERSES = [
	universe('en', 101, 'Quantum'),
	universe('en', 140, 'Rigel'),
	universe('fr', 172, 'Tucana'),
	universe('fr', Number(DEFAULT_UNIVERSE.universe), 'Astrid'),
];

// Mirrors how every view uses the picker: it owns the selection state.
function Harness({ onSelect }) {
	const [selection, setSelection] = useState({ lang: '', universe: '' });
	return (
		<>
			<UniversePicker
				value={selection}
				onChange={(next) => {
					setSelection(next);
					onSelect?.(next);
				}}
			/>
			<output>
				{selection.lang}/{selection.universe}
			</output>
		</>
	);
}

const selected = () => screen.getByRole('status').textContent;

beforeEach(() => {
	vi.clearAllMocks();
	fetchUniverses.mockResolvedValue(UNIVERSES);
});

describe('<UniversePicker />', () => {
	it('preselects the default universe', async () => {
		renderWithI18n(<Harness />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await waitFor(() =>
			expect(selected()).toBe(`${DEFAULT_UNIVERSE.lang}/${DEFAULT_UNIVERSE.universe}`),
		);
	});

	// The universe the user plays in wins over the interface language, which is
	// only a fallback for when that universe is gone.
	it('preselects it whatever the interface language', async () => {
		renderWithI18n(<Harness />, { lang: 'fr' });
		await screen.findByLabelText('Communauté');

		await waitFor(() => expect(selected()).toContain(DEFAULT_UNIVERSE.universe));
	});

	it('shows the default community and universe in the dropdowns', async () => {
		renderWithI18n(<Harness />, { lang: 'en' });

		// Wait on the universe, not the community: the community select is right one
		// render earlier, while the parent still holds an empty selection.
		await waitFor(() =>
			expect(screen.getByLabelText('Universe')).toHaveValue(DEFAULT_UNIVERSE.universe),
		);
		expect(screen.getByLabelText('Community')).toHaveValue(DEFAULT_UNIVERSE.lang);
	});

	it('falls back to the interface language when the default universe has closed', async () => {
		fetchUniverses.mockResolvedValue([universe('en', 101, 'Quantum'), universe('fr', 172, 'Tucana')]);
		renderWithI18n(<Harness />, { lang: 'en' });
		await screen.findByLabelText('Community');

		await waitFor(() => expect(selected()).toBe('en/101'));
	});

	it('still lets another universe be picked', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Harness />, { lang: 'en' });
		await waitFor(() => expect(selected()).toContain(DEFAULT_UNIVERSE.universe));

		await user.selectOptions(screen.getByLabelText('Universe'), '172');

		expect(selected()).toBe('fr/172');
	});

	// Leaving the community and coming back lands on the default universe, not on
	// whichever one happens to be first in the list.
	it('comes back to the default universe with its community', async () => {
		const user = userEvent.setup();
		renderWithI18n(<Harness />, { lang: 'en' });
		await waitFor(() => expect(selected()).toContain(DEFAULT_UNIVERSE.universe));

		await user.selectOptions(screen.getByLabelText('Community'), 'en');
		expect(selected()).toBe('en/101');

		await user.selectOptions(screen.getByLabelText('Community'), 'fr');
		expect(selected()).toBe(`${DEFAULT_UNIVERSE.lang}/${DEFAULT_UNIVERSE.universe}`);
	});

	it('reports a lobby failure instead of an empty dropdown', async () => {
		fetchUniverses.mockRejectedValue(new Error('upstream responded 502'));
		renderWithI18n(<Harness />, { lang: 'en' });

		const alert = await screen.findByRole('alert');
		expect(alert).toHaveTextContent('upstream responded 502');
	});
});
