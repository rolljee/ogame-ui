import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'og_ui_lang';

function getInitialLang() {
	const saved = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY);
	if (saved && translations[saved]) {
		return saved;
	}
	const browser = typeof navigator !== 'undefined' && navigator.language;
	if (browser && browser.toLowerCase().startsWith('fr')) {
		return 'fr';
	}
	return 'en';
}

const I18nContext = createContext({ lang: 'fr', setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }) {
	const [lang, setLangState] = useState(getInitialLang);

	const setLang = useCallback((next) => {
		if (!translations[next]) return;
		setLangState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* ignore persistence errors (e.g. private mode) */
		}
	}, []);

	const t = useCallback(
		(key, vars) => {
			let str = (translations[lang] && translations[lang][key]) || key;
			if (vars) {
				for (const [k, v] of Object.entries(vars)) {
					str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
				}
			}
			return str;
		},
		[lang],
	);

	const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	return useContext(I18nContext);
}
