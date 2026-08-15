// Exchange rates, written the way the game states them: metal : crystal :
// deuterium, the worth of one unit of each against the others.
//
// The custom-rate form hands three free-text numbers straight to `ogamejs`,
// which does not defend against them: an emptied field reads as 0 and silently
// returns 0 of that resource, a zeroed field divides by zero and comes back as
// `Infinity`, and a negative one yields a negative amount of resources. All
// three are answered here with "this rate is unusable" rather than with a
// number.
//
// The scale of the rate is no longer our problem: `4:3:2` and `2:1.5:1` are the
// same rate, and ogamejs >= 4.0.1 reads them identically whichever resource is
// being sold (it used to pay out scaled by the deuterium term when selling
// deuterium — rolljee/ogamejs#39).

export const RATE_PARTS = 3;

// The three terms as numbers, or null when the rate cannot be used. A term must
// be a real, strictly positive number: 0 has no inverse and a negative worth is
// not a thing the game can express.
export function parseRate(rate) {
	const parts = String(rate).split(':');
	if (parts.length !== RATE_PARTS) return null;

	const values = parts.map((part) => (part.trim() === '' ? NaN : Number(part)));
	if (values.some((value) => !Number.isFinite(value) || value <= 0)) return null;

	return values;
}

export function isValidRate(rate) {
	return parseRate(rate) !== null;
}
