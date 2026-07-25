import { describe, it, expect } from 'vitest';
import {
	computeMoonbreak,
	splitWaves,
	MIN_MOON_SIZE,
	MAX_MOON_SIZE,
} from './formulas';

describe('splitWaves', () => {
	it('spreads a multiple of 6 evenly', () => {
		expect(splitWaves(60)).toEqual({ base: 10, remainder: 0 });
	});

	it('puts the leftovers in the remainder', () => {
		expect(splitWaves(100)).toEqual({ base: 16, remainder: 4 });
	});

	it('makes single-ship waves below 6', () => {
		expect(splitWaves(4)).toEqual({ base: 0, remainder: 4 });
	});
});

describe('computeMoonbreak', () => {
	it('rejects a moon smaller than the in-game minimum', () => {
		const result = computeMoonbreak({ moonSize: MIN_MOON_SIZE - 1, attackers: [100] });
		expect(result.ok).toBe(false);
		expect(result.errors).toContain('size');
	});

	it('rejects a moon larger than the in-game maximum', () => {
		const result = computeMoonbreak({ moonSize: MAX_MOON_SIZE + 1, attackers: [100] });
		expect(result.ok).toBe(false);
		expect(result.errors).toContain('size');
	});

	it('rejects an empty or zero fleet', () => {
		expect(computeMoonbreak({ moonSize: 8944, attackers: [''] }).errors).toContain('rip');
		expect(computeMoonbreak({ moonSize: 8944, attackers: [0] }).errors).toContain('rip');
	});

	it('rejects more than 4 attackers', () => {
		const result = computeMoonbreak({ moonSize: 8944, attackers: [10, 10, 10, 10, 10] });
		expect(result.errors).toContain('attackers');
	});

	it('rejects no attacker at all', () => {
		expect(computeMoonbreak({ moonSize: 8944, attackers: [] }).errors).toContain('attackers');
	});

	it('accepts numeric strings, as typed in the form', () => {
		expect(computeMoonbreak({ moonSize: '8944', attackers: ['100'] }).ok).toBe(true);
	});

	it('returns a probability between 0 and 100', () => {
		const { probability } = computeMoonbreak({ moonSize: 8944, attackers: [100] });
		expect(probability).toBeGreaterThan(0);
		expect(probability).toBeLessThanOrEqual(100);
	});

	it('is certain to break the smallest moon with a large fleet', () => {
		// 200 Deathstars means 33 per wave on a 3464 km moon: each wave alone
		// already caps at 100%.
		const { probability } = computeMoonbreak({ moonSize: MIN_MOON_SIZE, attackers: [200] });
		expect(probability).toBe(100);
	});

	it('gives a bigger moon a lower chance for the same fleet', () => {
		const small = computeMoonbreak({ moonSize: 5000, attackers: [50] });
		const big = computeMoonbreak({ moonSize: 8944, attackers: [50] });
		expect(big.probability).toBeLessThan(small.probability);
	});

	it('improves the odds with more Deathstars', () => {
		const few = computeMoonbreak({ moonSize: 8944, attackers: [30] });
		const many = computeMoonbreak({ moonSize: 8944, attackers: [120] });
		expect(many.probability).toBeGreaterThan(few.probability);
	});

	it('improves the odds when a second attacker joins', () => {
		const solo = computeMoonbreak({ moonSize: 8944, attackers: [100] });
		const duo = computeMoonbreak({ moonSize: 8944, attackers: [100, 80] });
		expect(duo.probability).toBeGreaterThan(solo.probability);
	});

	it('sums the fleets and reports one wave plan per attacker', () => {
		const result = computeMoonbreak({ moonSize: 8944, attackers: [100, 80] });
		expect(result.totalRip).toBe(180);
		expect(result.attackers).toEqual([
			{ rip: 100, base: 16, remainder: 4 },
			{ rip: 80, base: 13, remainder: 2 },
		]);
	});

	it('keeps the loss estimate inside the fleet size', () => {
		const { losses, totalRip } = computeMoonbreak({ moonSize: 8944, attackers: [100] });
		expect(losses.mean).toBeGreaterThan(0);
		expect(losses.mean).toBeLessThanOrEqual(totalRip);
		for (const { min, max } of losses.bands) {
			expect(min).toBeGreaterThanOrEqual(0);
			expect(max).toBeLessThanOrEqual(totalRip);
			expect(min).toBeLessThanOrEqual(max);
		}
	});

	it('widens the interval as the confidence grows', () => {
		const [band68, band95, band99] = computeMoonbreak({
			moonSize: 8944,
			attackers: [100],
		}).losses.bands;
		expect(band95.max - band95.min).toBeGreaterThan(band68.max - band68.min);
		expect(band99.max - band99.min).toBeGreaterThan(band95.max - band95.min);
	});

	it('loses more Deathstars on a bigger moon', () => {
		const small = computeMoonbreak({ moonSize: 4000, attackers: [100] });
		const big = computeMoonbreak({ moonSize: 8944, attackers: [100] });
		expect(big.losses.mean).toBeGreaterThan(small.losses.mean);
	});
});
