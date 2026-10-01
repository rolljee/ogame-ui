import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider } from '../i18n/I18nContext';
import {
	UNIVERSE_STORAGE_KEY,
	UniverseProvider,
	UniverseSelect,
} from '../universe/UniverseContext';

// Every component calls useI18n(), so they all need the provider. The language
// is pinned through the persisted key the provider reads on mount, which keeps
// assertions independent from the host's navigator.language.
//
// The universe is shared through a provider too, and remembered between
// visits; every render starts from a clean slate and on the default route.
export function renderWithI18n(ui, { lang = 'en' } = {}) {
	localStorage.setItem('og_ui_lang', lang);
	localStorage.removeItem(UNIVERSE_STORAGE_KEY);
	window.history.replaceState(null, '', '/');
	return render(
		<I18nProvider>
			<UniverseProvider>{ui}</UniverseProvider>
		</I18nProvider>,
	);
}

// A data view as the shell shows it: the shared universe picker above it.
export function renderView(ui, options) {
	return renderWithI18n(
		<>
			<UniverseSelect />
			{ui}
		</>,
		options,
	);
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
