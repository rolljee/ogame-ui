// Shared number formatting.

// Group thousands with dots, the way OGame itself does.
export function groupDigits(value) {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
