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
