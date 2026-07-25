import { describe, it, expect } from 'vitest';
import { translations, LANGUAGES } from './translations';

const codes = LANGUAGES.map(({ code }) => code);

describe('translations', () => {
	it('covers every advertised language', () => {
		expect(Object.keys(translations).sort()).toEqual([...codes].sort());
	});

	// A key present in one language but not the other renders as the raw key.
	it('defines the same keys in every language', () => {
		const [reference, ...others] = codes;
		const referenceKeys = Object.keys(translations[reference]).sort();
		for (const code of others) {
			expect(Object.keys(translations[code]).sort()).toEqual(referenceKeys);
		}
	});

	it('has no empty string', () => {
		for (const code of codes) {
			for (const [key, value] of Object.entries(translations[code])) {
				expect(value, `${code}.${key}`).toBeTruthy();
			}
		}
	});
});
