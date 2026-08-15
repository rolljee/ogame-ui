import { describe, it, expect } from 'vitest';
import OgameTrader from 'ogamejs/trades';

import { isValidRate, parseRate } from './rate';

describe('parseRate', () => {
	it('reads the three terms in metal:crystal:deut order', () => {
		expect(parseRate('2:1.5:1')).toEqual([2, 1.5, 1]);
	});

	it('rejects a rate that is not three terms', () => {
		expect(parseRate('2:1')).toBeNull();
		expect(parseRate('2:1.5:1:1')).toBeNull();
	});

	// The custom-rate form lets a field be emptied, and an empty field used to
	// reach the library as 0.
	it('rejects an empty term', () => {
		expect(parseRate('2::1')).toBeNull();
		expect(parseRate('2:1.5:')).toBeNull();
	});

	// A zeroed term divides by zero in the library and came back as Infinity.
	it('rejects a zero term', () => {
		expect(parseRate('0:1.5:1')).toBeNull();
		expect(parseRate('2:0:1')).toBeNull();
		expect(parseRate('2:1.5:0')).toBeNull();
	});

	it('rejects a negative or non-numeric term', () => {
		expect(parseRate('-2:1.5:1')).toBeNull();
		expect(parseRate('two:1.5:1')).toBeNull();
	});

	it('accepts spaces around the terms, as a pasted rate carries them', () => {
		expect(parseRate('2.5 : 1.6 : 1')).toEqual([2.5, 1.6, 1]);
	});
});

describe('isValidRate', () => {
	it('agrees with parseRate', () => {
		expect(isValidRate('2:1.5:1')).toBe(true);
		expect(isValidRate('2::1')).toBe(false);
	});
});

// A rate is a ratio, so a rate and any multiple of it are the same rate. This
// held on the metal and crystal branches of ogamejs but not on the deuterium
// one, which read the other terms raw and paid out scaled by the deuterium
// term; the app worked around it by rescaling every rate before handing it
// over. Fixed upstream in ogamejs 4.0.1 (rolljee/ogamejs#39) and pinned here,
// since the workaround is gone and nothing else would catch a regression.
describe('the library reads equivalent rates identically', () => {
	const equivalent = ['2:1.5:1', '4:3:2', '10:7.5:5'];

	it('sells deuterium the same way whatever the scale of the rate', () => {
		const results = equivalent.map((rate) => OgameTrader.sellDeut(1000, 60, 40, rate));
		expect(results[1]).toEqual(results[0]);
		expect(results[2]).toEqual(results[0]);
		expect(results[0]).toEqual({ metal: 1200, crystal: 600 });
	});

	it('sells metal the same way whatever the scale of the rate', () => {
		const results = equivalent.map((rate) => OgameTrader.sellMetal(1000, 60, 40, rate));
		expect(results[1]).toEqual(results[0]);
		expect(results[2]).toEqual(results[0]);
	});

	it('sells crystal the same way whatever the scale of the rate', () => {
		const results = equivalent.map((rate) => OgameTrader.sellCrystal(1000, 60, 40, rate));
		expect(results[1]).toEqual(results[0]);
		expect(results[2]).toEqual(results[0]);
	});
});
