import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider, useI18n } from './I18nContext';

function Probe() {
	const { lang, setLang, t } = useI18n();
	return (
		<div>
			<span data-testid="lang">{lang}</span>
			<span data-testid="label">{t('resource.metal')}</span>
			<span data-testid="missing">{t('nope.unknown')}</span>
			<button type="button" onClick={() => setLang('fr')}>
				fr
			</button>
			<button type="button" onClick={() => setLang('de')}>
				de
			</button>
		</div>
	);
}

function renderProbe() {
	return render(
		<I18nProvider>
			<Probe />
		</I18nProvider>,
	);
}

describe('I18nProvider', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('restores the persisted language', () => {
		localStorage.setItem('og_ui_lang', 'fr');
		renderProbe();
		expect(screen.getByTestId('lang')).toHaveTextContent('fr');
		expect(screen.getByTestId('label')).toHaveTextContent('Métal');
	});

	it('ignores a persisted language it does not know', () => {
		localStorage.setItem('og_ui_lang', 'kl');
		renderProbe();
		// jsdom reports an English navigator, so the fallback lands on 'en'.
		expect(screen.getByTestId('lang')).toHaveTextContent('en');
	});

	it('switches language and persists the choice', async () => {
		const user = userEvent.setup();
		renderProbe();
		expect(screen.getByTestId('label')).toHaveTextContent('Metal');

		await user.click(screen.getByRole('button', { name: 'fr' }));

		expect(screen.getByTestId('label')).toHaveTextContent('Métal');
		expect(localStorage.getItem('og_ui_lang')).toBe('fr');
	});

	it('refuses an unsupported language', async () => {
		const user = userEvent.setup();
		renderProbe();

		await user.click(screen.getByRole('button', { name: 'de' }));

		expect(screen.getByTestId('lang')).toHaveTextContent('en');
		expect(localStorage.getItem('og_ui_lang')).toBeNull();
	});

	it('returns the key itself when no translation exists', () => {
		renderProbe();
		expect(screen.getByTestId('missing')).toHaveTextContent('nope.unknown');
	});

	it('interpolates {placeholders}', () => {
		function Vars() {
			const { t } = useI18n();
			// t() is generic: any key, any vars, so a raw key exercises it too.
			return <span data-testid="out">{t('{a} and {b} and {a}', { a: 'x', b: 'y' })}</span>;
		}
		render(
			<I18nProvider>
				<Vars />
			</I18nProvider>,
		);
		expect(screen.getByTestId('out')).toHaveTextContent('x and y and x');
	});
});
