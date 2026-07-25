import { describe, it, expect } from 'vitest';
import {
	CURVE_TARGETS,
	breakProbability,
	computeMoonbreak,
	describeCurve,
	distribute,
	ripForProbability,
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

describe('distribute', () => {
	it('splits evenly when it divides', () => {
		expect(distribute(120, 4)).toEqual([30, 30, 30, 30]);
	});

	it('gives the leftovers to the first attackers', () => {
		expect(distribute(10, 4)).toEqual([3, 3, 2, 2]);
	});

	it('leaves an attacker empty rather than fail on a tiny fleet', () => {
		expect(distribute(2, 4)).toEqual([1, 1, 0, 0]);
	});
});

describe('breakProbability', () => {
	// Same input as the headline figure of computeMoonbreak, as a fraction.
	it('agrees with the headline probability', () => {
		const { probability } = computeMoonbreak({ moonSize: 8944, attackers: [100] });
		expect(breakProbability(8944, [100]) * 100).toBeCloseTo(probability, 1);
	});

	it('grows with the fleet', () => {
		expect(breakProbability(8944, [50])).toBeLessThan(breakProbability(8944, [100]));
	});

	// An empty attacker contributes nothing, which is what makes distribute safe.
	it('ignores an attacker without a Deathstar', () => {
		expect(breakProbability(8944, [30, 0])).toBeCloseTo(breakProbability(8944, [30]), 10);
	});
});

describe('ripForProbability', () => {
	it('finds the smallest fleet reaching the target', () => {
		const rip = ripForProbability(8944, 1, 95);
		expect(breakProbability(8944, distribute(rip, 1)) * 100).toBeGreaterThanOrEqual(95);
		expect(breakProbability(8944, distribute(rip - 1, 1)) * 100).toBeLessThan(95);
	});

	it('needs fewer Deathstars on a small moon', () => {
		expect(ripForProbability(4000, 1, 95)).toBeLessThan(ripForProbability(8944, 1, 95));
	});

	it('needs fewer Deathstars when the waves are spread over more attackers', () => {
		expect(ripForProbability(8944, 4, 95)).toBeLessThan(ripForProbability(8944, 1, 95));
	});

	it('reports an unreachable target instead of guessing', () => {
		expect(ripForProbability(8944, 1, 100)).toBeNull();
	});
});

describe('describeCurve', () => {
	const curve = (over = {}) =>
		describeCurve({ moonSize: 8944, attackerCount: 1, currentRip: 100, ...over });

	it('rises from 1 Deathstar to the far end', () => {
		const { points } = curve();
		expect(points[0].rip).toBe(1);
		expect(points[0].probability).toBeLessThan(points[points.length - 1].probability);
	});

	it('never grows past 100 %', () => {
		for (const { probability } of curve().points) {
			expect(probability).toBeLessThanOrEqual(100);
			expect(probability).toBeGreaterThanOrEqual(0);
		}
	});

	it('marks the fleet currently entered, exactly once', () => {
		const marked = curve().points.filter((point) => point.current);
		expect(marked).toHaveLength(1);
		expect(marked[0].rip).toBe(100);
	});

	it('reaches at least the fleet entered, however big', () => {
		expect(curve({ currentRip: 400 }).upTo).toBeGreaterThanOrEqual(400);
	});

	it('still plots a readable range for a single Deathstar', () => {
		expect(curve({ currentRip: 1 }).upTo).toBeGreaterThan(1);
	});

	it('annotates every threshold', () => {
		expect(curve().targets.map(({ target }) => target)).toEqual(CURVE_TARGETS);
	});

	// 60 points at most, so the inline SVG stays small.
	it('caps the number of points', () => {
		expect(curve({ currentRip: 600 }).points.length).toBeLessThanOrEqual(62);
	});

	it('keeps the points in order and free of duplicates', () => {
		const rips = curve().points.map((point) => point.rip);
		expect(rips).toEqual([...new Set(rips)].sort((a, b) => a - b));
	});
});
