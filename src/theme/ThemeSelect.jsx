import React, { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

// The same desk in other inks; each theme only remaps the colour tokens
// (src/themes.scss). Graphite is the default and needs no attribute.
export const THEMES = [
	{ id: 'graphite', labelKey: 'theme.graphite', color: '#111418' },
	{ id: 'telex', labelKey: 'theme.telex', color: '#dcdfd8' },
	{ id: 'cyanotype', labelKey: 'theme.cyanotype', color: '#0c2135' },
	{ id: 'operations', labelKey: 'theme.operations', color: '#14160e' },
	{ id: 'contrast', labelKey: 'theme.contrast', color: '#000000' },
];

export const THEME_STORAGE_KEY = 'og_ui_theme';

function readTheme() {
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (THEMES.some(({ id }) => id === stored)) return stored;
	} catch {
		// Blocked storage: the default theme.
	}
	return THEMES[0].id;
}

// index.html applies the stored theme before the first paint; this keeps it in
// step afterwards, along with the browser chrome colour.
export function applyTheme(id) {
	const root = document.documentElement;
	if (id === THEMES[0].id) root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', id);

	const meta = document.querySelector('meta[name="theme-color"]');
	const theme = THEMES.find((entry) => entry.id === id);
	if (meta && theme) meta.setAttribute('content', theme.color);
}

function ThemeSelect() {
	const { t } = useI18n();
	const [theme, setTheme] = useState(readTheme);

	useEffect(() => {
		applyTheme(theme);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Remembering is a convenience.
		}
	}, [theme]);

	return (
		<label className="theme-select">
			<span className="visually-hidden">{t('theme.label')}</span>
			<select value={theme} onChange={(event) => setTheme(event.target.value)}>
				{THEMES.map(({ id, labelKey }) => (
					<option key={id} value={id}>
						{t(labelKey)}
					</option>
				))}
			</select>
		</label>
	);
}

export default ThemeSelect;
