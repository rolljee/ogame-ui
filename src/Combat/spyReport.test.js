import { describe, it, expect } from 'vitest';
import { countParts, parseSpyReport } from './spyReport';

// As copied from the message page: a label, then its figure, row by row.
const FR_REPORT = `Ressources sur Colonie [4:123:8] (Joueur: Darkvador) le 05.10.2026 21:42:13
Métal:
4.012.345
Cristal:
1.250.000
Deutérium:
380.500
Énergie:
5.120
Activité: 15 minutes
Chance de contre-espionnage : 0%

Flottes
Petit transporteur	12
Grand transporteur	3
Chasseur léger	1.500
Sonde d'espionnage	7
Satellite solaire	40

Défense
Lanceur de missiles	2.000
Artillerie laser légère	1.200
Petit bouclier	1
Grand bouclier	1
Missile d'interception	20

Bâtiment
Mine de métal	32
Mine de cristal	28
Synthétiseur de deutérium	30
Hangar de métal	12

Recherche
Technologie Énergie	14
Technologie Armes	17
Technologie Bouclier	16
Technologie Protection des vaisseaux spatiaux	18
Technologie Hyperespace	10`;

describe('parseSpyReport', () => {
	it('reads a French report copied from the game', () => {
		expect(parseSpyReport(FR_REPORT)).toEqual({
			resources: { metal: '4012345', crystal: '1250000', deuterium: '380500' },
			ships: { 11: '12', 12: '3', 1: '1500', 15: '7', 16: '40' },
			defenses: { 201: '2000', 202: '1200', 207: '1', 208: '1' },
			techs: { weapons: '17', shielding: '16', armour: '18' },
		});
	});

	it('reads an English report on one line per pair, with shortened figures', () => {
		const report = `Resources on Homeworld [1:2:3] Metal: 1.5M Crystal: 850k Deuterium: 120,000
Fleets Deathstar 2 Espionage Probe 1
Defense Rocket Launcher 300 Large Shield Dome 1
Research Weapons Technology 20 Shielding Technology 19 Armour Technology 21`;
		expect(parseSpyReport(report)).toEqual({
			resources: { metal: '1500000', crystal: '850000', deuterium: '120000' },
			ships: { 8: '2', 15: '1' },
			defenses: { 201: '300', 208: '1' },
			techs: { weapons: '20', shielding: '19', armour: '21' },
		});
	});

	it('reads the French short forms of millions and billions', () => {
		expect(parseSpyReport('Métal: 1,23Mn\nCristal: 2Md').resources).toEqual({
			metal: '1230000',
			crystal: '2000000000',
		});
	});

	it('does not take a building or a missile for a resource or a unit', () => {
		const found = parseSpyReport('Mine de métal 30\nHangar de cristal 10\nLanceur de missiles 5');
		expect(found.resources).toEqual({});
		expect(found.defenses).toEqual({ 201: '5' });
	});

	it('says when nothing was recognised', () => {
		expect(parseSpyReport('bonjour')).toBeNull();
		expect(parseSpyReport('')).toBeNull();
	});

	it('counts what it found', () => {
		expect(countParts(parseSpyReport(FR_REPORT))).toEqual({ ships: 5, defenses: 4, techs: 3, resources: 3 });
	});
});
