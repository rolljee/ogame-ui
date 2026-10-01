// Moonbreak (destruction de lune) model. The arithmetic itself — waves,
// chance, losses — comes from ogamejs (`Fleets.getMoonbreak*`), the same code
// behind the `!mb` command of og-bot-discord. What stays here is what the view
// needs on top of it: validation, rounding, the wave plan and the curve.

import Ogame from 'ogamejs';

const { getMoonbreakWaves, getMoonbreakChance, getMoonbreakLosses } = Ogame.Fleets;

export const MIN_MOON_SIZE = 3464;
export const MAX_MOON_SIZE = 8944;
export const MAX_ATTACKERS = 4;
export const WAVES_PER_ATTACKER = 6;

function round2(n) {
	return Math.round(n * 100) / 100;
}

// An attacker spreads their Deathstars over 6 waves. When the count is not a
// multiple of 6, `remainder` waves carry one extra ship.
export function splitWaves(rip) {
	return {
		base: Math.floor(rip / WAVES_PER_ATTACKER),
		remainder: rip % WAVES_PER_ATTACKER,
	};
}

// The waves one attacker actually sends, in the order they fire: the extra
// ships first, then the rest; under 6 Deathstars, the last waves are empty.
export function attackerWaves(rip) {
	return getMoonbreakWaves(rip);
}

// Every wave of the whole attack, in firing order. Attackers go one after the
// other: the moon is gone the moment one wave succeeds.
export function attackWaves(fleets) {
	return fleets.flatMap(getMoonbreakWaves);
}

// Expected Deathstar losses, with the 68 / 95 / 99 % bands, rounded for display.
function estimateLosses(moonSize, fleets) {
	const { mean, bands } = getMoonbreakLosses(moonSize, fleets);

	return {
		mean: round2(mean),
		bands: bands.map(({ confidence, min, max }) => ({
			confidence,
			min: round2(min),
			max: round2(max),
		})),
	};
}

// --- Probability curve -----------------------------------------------------
//
// The one thing a Discord answer cannot give: how the chance evolves with the
// fleet size, so you can see where sending more Deathstars stops paying off.
// The same attackers are kept and the total is spread evenly between them.

// Probability (0..1) that a set of fleets breaks the moon.
export function breakProbability(moonSize, fleets) {
	return getMoonbreakChance(moonSize, fleets);
}

// Spread `total` Deathstars over `count` attackers as evenly as possible; the
// first ones take the leftovers.
export function distribute(total, count) {
	const base = Math.floor(total / count);
	return Array.from({ length: count }, (_, i) => base + (i < total % count ? 1 : 0));
}

// The thresholds worth calling out: "how many RIP for a coin flip / a safe bet".
export const CURVE_TARGETS = [50, 95, 99];

// The threshold the x axis extends to. Stopping at 99 % would stretch the axis
// to 585 Deathstars on a full-size moon and squash everything anyone actually
// sends into the left third; 99 % remains listed as a figure below the chart.
export const CURVE_REACH = 95;

// A moon never reaches 100 %, and past this the answer is "bring another
// attacker", not more ships. Also bounds the search below.
export const CURVE_LIMIT = 600;

// Smallest total number of Deathstars reaching `target` percent, or null when
// this moon cannot be broken that reliably by that many attackers.
export function ripForProbability(moonSize, attackerCount, target) {
	for (let total = 1; total <= CURVE_LIMIT; total += 1) {
		if (breakProbability(moonSize, distribute(total, attackerCount)) * 100 >= target) {
			return total;
		}
	}
	return null;
}

// Points are capped so the chart stays a light inline SVG.
const MAX_POINTS = 60;

// The curve to plot, plus the thresholds to annotate it with. `currentRip` is
// the fleet currently entered in the form, so it can be marked on the curve.
export function describeCurve({ moonSize, attackerCount, currentRip }) {
	const targets = CURVE_TARGETS.map((target) => ({
		target,
		rip: ripForProbability(moonSize, attackerCount, target),
	}));

	// Show the whole climb up to CURVE_REACH, and never less than the fleet
	// already entered. The floor keeps a tiny fleet from drawing a 2-point chart.
	const reach =
		targets.find(({ target }) => target === CURVE_REACH)?.rip ?? CURVE_LIMIT;
	const upTo = Math.max(currentRip, reach, attackerCount * WAVES_PER_ATTACKER);
	const step = Math.ceil(upTo / MAX_POINTS);

	const points = [];
	for (let rip = step; rip < upTo; rip += step) {
		points.push(rip);
	}
	// The two ends always belong to the curve, and so does the current fleet.
	const ripCounts = [...new Set([1, ...points, currentRip, upTo])].sort((a, b) => a - b);

	return {
		upTo,
		targets,
		points: ripCounts.map((rip) => ({
			rip,
			probability: round2(breakProbability(moonSize, distribute(rip, attackerCount)) * 100),
			current: rip === currentRip,
		})),
	};
}

// `attackers` is a list of Deathstar counts, one per attacking player.
// Returns { ok: false, errors } on invalid input, so the UI can stay silent
// until the form is usable.
export function computeMoonbreak({ moonSize, attackers }) {
	const size = Number(moonSize);
	const fleets = attackers.map(Number);
	const errors = [];

	if (!Number.isFinite(size) || size < MIN_MOON_SIZE || size > MAX_MOON_SIZE) {
		errors.push('size');
	}
	if (fleets.length < 1 || fleets.length > MAX_ATTACKERS) {
		errors.push('attackers');
	}
	if (fleets.some((rip) => !Number.isInteger(rip) || rip < 1)) {
		errors.push('rip');
	}

	if (errors.length > 0) {
		return { ok: false, errors };
	}

	const totalRip = fleets.reduce((acc, rip) => acc + rip, 0);

	return {
		ok: true,
		probability: round2(getMoonbreakChance(size, fleets) * 100),
		totalRip,
		attackers: fleets.map((rip) => ({ rip, ...splitWaves(rip) })),
		losses: estimateLosses(size, fleets),
	};
}
