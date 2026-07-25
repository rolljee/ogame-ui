import { describe, it, expect } from 'vitest';
import { formatCoordinates, galaxyUrl, parseCoordinates } from './galaxy';

describe('parseCoordinates', () => {
	it('reads galaxy:system:position', () => {
		expect(parseCoordinates('4:212:8')).toEqual({ galaxy: 4, system: 212, position: 8 });
	});

	it('tolerates spaces around the separators', () => {
		expect(parseCoordinates(' 1 : 2 : 3 ')).toEqual({ galaxy: 1, system: 2, position: 3 });
	});

	it('rejects anything that is not three positive integers', () => {
		expect(parseCoordinates('4:212')).toBeNull();
		expect(parseCoordinates('4:212:8:1')).toBeNull();
		expect(parseCoordinates('4:x:8')).toBeNull();
		expect(parseCoordinates('0:1:1')).toBeNull();
		expect(parseCoordinates('')).toBeNull();
	});

	it('rejects a position past the 15 slots of a system', () => {
		expect(parseCoordinates('1:1:16')).toBeNull();
	});

	it('honours the size of the universe when it is known', () => {
		const size = { galaxies: 7, systems: 499 };
		expect(parseCoordinates('8:1:1', size)).toBeNull();
		expect(parseCoordinates('1:500:1', size)).toBeNull();
		expect(parseCoordinates('7:499:15', size)).toEqual({
			galaxy: 7,
			system: 499,
			position: 15,
		});
	});
});

describe('galaxyUrl', () => {
	it('points at the galaxy view of the right universe', () => {
		expect(galaxyUrl({ universe: 172, lang: 'fr', galaxy: 4, system: 212, position: 8 })).toBe(
			'https://s172-fr.ogame.gameforge.com/game/index.php' +
				'?page=ingame&component=galaxy&galaxy=4&system=212&position=8',
		);
	});
});

describe('formatCoordinates', () => {
	it('joins the three numbers back with colons', () => {
		expect(formatCoordinates({ galaxy: 4, system: 212, position: 8 })).toBe('4:212:8');
	});
});
