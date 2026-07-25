import React from 'react';
import { render } from '@testing-library/react';
import { I18nProvider } from '../i18n/I18nContext';

// Every component calls useI18n(), so they all need the provider. The language
// is pinned through the persisted key the provider reads on mount, which keeps
// assertions independent from the host's navigator.language.
export function renderWithI18n(ui, { lang = 'en' } = {}) {
	localStorage.setItem('og_ui_lang', lang);
	return render(<I18nProvider>{ui}</I18nProvider>);
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
