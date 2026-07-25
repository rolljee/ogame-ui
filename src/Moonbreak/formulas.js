// Moonbreak (destruction de lune) model, ported from the `!mb` command of
// https://github.com/rolljee/og-bot-discord (mb.js).
//
// Everything here is pure arithmetic: no API call is involved, only the moon
// size and the number of Deathstars (RIP) each attacker sends.

export const MIN_MOON_SIZE = 3464;
export const MAX_MOON_SIZE = 8944;
export const MAX_ATTACKERS = 4;
export const WAVES_PER_ATTACKER = 6;

function round2(n) {
	return Math.round(n * 100) / 100;
}

// Official in-game formula: chance that a single wave of `ripPerWave`
// Deathstars destroys a moon of `moonSize` km. Capped at 1, since a wave
// cannot do better than certain destruction.
function waveProbability(moonSize, ripPerWave) {
	return Math.min(1, ((100 - Math.sqrt(moonSize)) * Math.sqrt(ripPerWave)) / 100);
}

// An attacker spreads their Deathstars over 6 waves. When the count is not a
// multiple of 6, `remainder` waves carry one extra ship.
export function splitWaves(rip) {
	return {
		base: Math.floor(rip / WAVES_PER_ATTACKER),
		remainder: rip % WAVES_PER_ATTACKER,
	};
}

// Probability that all 6 waves of one attacker fail to break the moon.
function failureProbability(moonSize, rip) {
	const { base, remainder } = splitWaves(rip);

	if (remainder === 0) {
		return (1 - waveProbability(moonSize, base)) ** WAVES_PER_ATTACKER;
	}

	return (
		(1 - waveProbability(moonSize, base + 1)) ** remainder *
		(1 - waveProbability(moonSize, base)) ** (WAVES_PER_ATTACKER - remainder)
	);
}

// Expected Deathstar losses over the whole attack. Each wave is treated as an
// independent Bernoulli draw, so the variance of the total is the sum of the
// per-wave variances; the spread is then summarised as a gaussian around the
// mean (1σ / 2σ / 3σ ≈ 68 % / 95 % / 99 %).
function estimateLosses(moonSize, totalRip, attackerCount) {
	const waves = Math.min(totalRip, attackerCount * WAVES_PER_ATTACKER);
	const ripPerWave = totalRip / waves;
	const survival = 1 - waveProbability(moonSize, ripPerWave);
	const destructionRate = Math.sqrt(moonSize) / 200;

	let mean = 0;
	let variance = 0;

	// Losses accumulate wave by wave, each one weighted by the probability that
	// every earlier wave failed (a successful wave ends the attack).
	for (let i = 0; i < waves; i += 1) {
		const p = destructionRate * survival ** i;
		mean += ripPerWave * p;
		variance += ripPerWave * p * (1 - p);
	}

	const sigma = Math.sqrt(variance);

	function band(sigmas) {
		return {
			min: round2(Math.max(mean - sigmas * sigma, 0)),
			max: round2(Math.min(mean + sigmas * sigma, totalRip)),
		};
	}

	return {
		mean: round2(mean),
		bands: [
			{ confidence: 68, ...band(1) },
			{ confidence: 95, ...band(2) },
			{ confidence: 99, ...band(3) },
		],
	};
}

// --- Probability curve -----------------------------------------------------
//
// The one thing a Discord answer cannot give: how the chance evolves with the
// fleet size, so you can see where sending more Deathstars stops paying off.
// The same attackers are kept and the total is spread evenly between them.

// Probability (0..1) that a set of fleets breaks the moon.
export function breakProbability(moonSize, fleets) {
	return 1 - fleets.reduce((acc, rip) => acc * failureProbability(moonSize, rip), 1);
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

	const failure = fleets.reduce((acc, rip) => acc * failureProbability(size, rip), 1);
	const totalRip = fleets.reduce((acc, rip) => acc + rip, 0);

	return {
		ok: true,
		probability: round2((1 - failure) * 100),
		totalRip,
		attackers: fleets.map((rip) => ({ rip, ...splitWaves(rip) })),
		losses: estimateLosses(size, totalRip, fleets.length),
	};
}
