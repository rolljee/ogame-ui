import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithI18n, screen, userEvent } from '../test/utils';
import ThemeSelect, { THEME_STORAGE_KEY } from './ThemeSelect';

beforeEach(() => {
	localStorage.removeItem(THEME_STORAGE_KEY);
	document.documentElement.removeAttribute('data-theme');
});

describe('<ThemeSelect />', () => {
	it('starts on graphite, with no theme attribute', () => {
		renderWithI18n(<ThemeSelect />);
		expect(screen.getByLabelText('Theme')).toHaveValue('graphite');
		expect(document.documentElement).not.toHaveAttribute('data-theme');
	});

	it('applies and remembers the picked theme', async () => {
		const user = userEvent.setup();
		renderWithI18n(<ThemeSelect />);

		await user.selectOptions(screen.getByLabelText('Theme'), 'telex');

		expect(document.documentElement).toHaveAttribute('data-theme', 'telex');
		expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('telex');
	});

	it('comes back on the remembered theme', () => {
		localStorage.setItem(THEME_STORAGE_KEY, 'cyanotype');
		renderWithI18n(<ThemeSelect />);
		expect(screen.getByLabelText('Theme')).toHaveValue('cyanotype');
		expect(document.documentElement).toHaveAttribute('data-theme', 'cyanotype');
	});

	it('ignores an unknown stored theme', () => {
		localStorage.setItem(THEME_STORAGE_KEY, 'neon');
		renderWithI18n(<ThemeSelect />);
		expect(screen.getByLabelText('Theme')).toHaveValue('graphite');
	});
});
