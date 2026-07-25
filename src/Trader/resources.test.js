import { describe, it, expect } from 'vitest';
import { RESOURCE_META, RESOURCE_ORDER, prettify } from './resources';
import { RESOURCES } from '../components/constants';

describe('prettify', () => {
	// Dots, the way OGame itself groups thousands.
	it('groups thousands with dots', () => {
		expect(prettify(1234567)).toBe('1.234.567');
	});

	it('leaves numbers under a thousand untouched', () => {
		expect(prettify(999)).toBe('999');
	});

	it('accepts numeric strings, as they come from the amount input', () => {
		expect(prettify('10000')).toBe('10.000');
	});

	it('falls back to 0 for empty or nullish input', () => {
		expect(prettify('')).toBe('0');
		expect(prettify(undefined)).toBe('0');
		expect(prettify(null)).toBe('0');
	});
});

describe('resource metadata', () => {
	it('is ordered metal:crystal:deut, the order rate strings use', () => {
		expect(RESOURCE_ORDER).toEqual([RESOURCES.metal, RESOURCES.crystal, RESOURCES.deut]);
	});

	it('describes every resource', () => {
		for (const resource of RESOURCE_ORDER) {
			expect(RESOURCE_META[resource]).toMatchObject({
				key: resource,
				color: expect.stringMatching(/^#[0-9a-f]{6}$/i),
				labelKey: `resource.${resource}`,
			});
		}
	});
});
