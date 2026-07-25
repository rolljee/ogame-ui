import { describe, it, expect } from 'vitest';
import {
	computeMoonLock,
	formatCoordinates,
	galaxyUrl,
	parseCoordinates,
	shipDebrisValue,
	shipsForThreshold,
} from './formulas';

const TUCANA = {
	name: 'Tucana',
	number: 172,
	language: 'fr',
	galaxies: 7,
	systems: 499,
	debrisFactor: 0.5,
};

describe('shipDebrisValue', () => {
	it('counts metal and crystal only, deuterium never lands in debris', () => {
		expect(shipDebrisValue(1)).toBe(4000); // Light Fighter: 3000 + 1000
		expect(shipDebrisValue(15)).toBe(1000); // Espionage Probe: 0 + 1000
	});
});

describe('shipsForThreshold', () => {
	// Parity with `!ogl 172 fr` on the Discord bot, at a 50 % debris factor.
	it('matches the bot on a 50 % universe', () => {
		expect(shipsForThreshold({ debrisFactor: 0.5, shipId: 1 })).toBe(1000);
		expect(shipsForThreshold({ debrisFactor: 0.5, shipId: 15 })).toBe(4000);
	});

	it('needs fewer ships as the debris factor rises', () => {
		expect(shipsForThreshold({ debrisFactor: 0.7, shipId: 1 })).toBe(715);
		expect(shipsForThreshold({ debrisFactor: 0.3, shipId: 1 })).toBe(1667);
	});

	it('rounds up: a fraction of a ship still has to be a whole one', () => {
		expect(shipsForThreshold({ debrisFactor: 0.3, shipId: 15 })).toBe(6667);
	});
});

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

describe('computeMoonLock', () => {
	it('reports the ships, the link and the debris factor', () => {
		const result = computeMoonLock({ data: TUCANA, coordinates: '4:212:8' });

		expect(result.ok).toBe(true);
		expect(result.debrisFactor).toBe(0.5);
		expect(result.ships.map(({ id, count }) => ({ id, count }))).toEqual([
			{ id: 1, count: 1000 },
			{ id: 15, count: 4000 },
		]);
		expect(result.url).toContain('s172-fr.ogame.gameforge.com');
		expect(result.url).toContain('galaxy=4&system=212&position=8');
	});

	it('waits for a universe', () => {
		expect(computeMoonLock({ data: null, coordinates: '4:212:8' }).error).toBe('universe');
	});

	it('rejects a universe without a debris factor', () => {
		const data = { ...TUCANA, debrisFactor: 0 };
		expect(computeMoonLock({ data, coordinates: '4:212:8' }).error).toBe('data');
	});

	it('rejects coordinates outside the universe', () => {
		expect(computeMoonLock({ data: TUCANA, coordinates: '9:1:1' }).error).toBe('coordinates');
	});
});
