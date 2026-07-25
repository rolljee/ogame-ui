import { describe, it, expect } from 'vitest';
import {
	LANGUAGES,
	UpstreamError,
	decodeStatus,
	matchesSearch,
	normalizeUniverses,
	parseAlliances,
	parsePlayerData,
	parsePlayers,
	parseServerData,
	resolveMembers,
	scanPlanets,
	serverBaseUrl,
	summarizeAlliance,
	universeTimestamp,
} from './gameforge';

// Fixtures trimmed from live responses of s172-fr (July 2026).
const SERVER_DATA_XML = `<?xml version="1.0" encoding="UTF-8"?>
<serverData timestamp="1784973517" serverId="fr172"><name>Tucana</name><number>172</number><language>fr</language><timezone>Europe/Paris</timezone><speed>10</speed><debrisFactor>0.5</debrisFactor><topScore>1403837599722.3</topScore><cargoHyperspaceTechMultiplier>5</cargoHyperspaceTechMultiplier><donutGalaxy>1</donutGalaxy></serverData>`;

const PLAYERS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<players timestamp="1784967405" serverId="fr172"><player id="1" name="Legor" status="a"/><player id="100010" name="Taramiscop" status="vI" alliance="500708"/><player id="100014" name="Rhéa" status="vIb"/><player id="100024" name="Nobody"/></players>`;

const PLAYER_DATA_XML = `<?xml version="1.0" encoding="UTF-8"?>
<playerData id="100010" name="Taramiscop" timestamp="1784979967" serverId="fr172"><positions><position type="0" score="3418739729.891">227</position><position type="3" score="47811956" ships="34151">483</position><position type="20" score="0">0</position></positions><planets><planet id="33623502" name="SS SECURE" coords="4:89:8"><moon id="33649938" name="t3" size="8602"/></planet><planet id="33621666" name="T1" coords="4:195:8"><moon id="33727763" name="t1" size="8544"/></planet><planet id="33621834" name="T2" coords="2:194:8"/></planets></playerData>`;

const ALLIANCES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<alliances timestamp="1784967455" serverId="fr172"><alliance id="500006" name="Staff OGame" tag="Staff" founder="100121" foundDate="1592572367" open="1"><player id="100121"/><player id="115238"/></alliance><alliance id="500014" name="PHOENIX QUASAR" tag="PHOENIX" founder="100149" foundDate="1592572368"><player id="100149"/></alliance></alliances>`;

describe('serverBaseUrl', () => {
	it('builds the universe host', () => {
		expect(serverBaseUrl('172', 'fr')).toBe('https://s172-fr.ogame.gameforge.com');
	});

	it('advertises the languages the lobby actually serves', () => {
		expect(LANGUAGES).toContain('fr');
		expect(LANGUAGES).toContain('en');
		expect(LANGUAGES).not.toContain('zz');
	});

	// The universe and language land in a hostname, so anything but a plain
	// number and a known community code has to be refused.
	it('refuses a non-numeric universe', () => {
		expect(() => serverBaseUrl('172.evil.com', 'fr')).toThrow(UpstreamError);
	});

	it('refuses an unknown language', () => {
		expect(() => serverBaseUrl('172', 'evil')).toThrow(UpstreamError);
	});

	it('refuses an injected host separator', () => {
		expect(() => serverBaseUrl('172', 'fr.evil.com')).toThrow(UpstreamError);
		expect(() => serverBaseUrl('1/../..', 'fr')).toThrow(UpstreamError);
	});

	it('answers 400 on bad input, not 500', () => {
		expect(() => serverBaseUrl('x', 'fr')).toThrow(expect.objectContaining({ status: 400 }));
	});
});

describe('decodeStatus', () => {
	it('reads an empty status as active', () => {
		expect(decodeStatus(undefined)).toMatchObject({ active: true, raw: '' });
	});

	it('decodes each flag independently', () => {
		expect(decodeStatus('vIb')).toMatchObject({
			active: false,
			vacation: true,
			longInactive: true,
			banned: true,
			inactive: false,
		});
	});

	it('tells short and long inactivity apart by case', () => {
		expect(decodeStatus('i')).toMatchObject({ inactive: true, longInactive: false });
		expect(decodeStatus('I')).toMatchObject({ inactive: false, longInactive: true });
	});

	it('decodes admin and outlaw', () => {
		expect(decodeStatus('a').admin).toBe(true);
		expect(decodeStatus('o').outlaw).toBe(true);
	});
});

describe('parseServerData', () => {
	it('exposes the settings the calculators need', () => {
		const data = parseServerData(SERVER_DATA_XML);
		expect(data).toMatchObject({
			name: 'Tucana',
			speed: 10,
			debrisFactor: 0.5,
			topScore: 1403837599722.3,
			cargoHyperspaceTechMultiplier: 5,
		});
	});

	it('keeps non-numeric settings as text', () => {
		expect(parseServerData(SERVER_DATA_XML).timezone).toBe('Europe/Paris');
	});

	it('keeps the upstream timestamp', () => {
		expect(parseServerData(SERVER_DATA_XML).timestamp).toBe(1784973517);
	});

	it('rejects a payload that is not serverData', () => {
		expect(() => parseServerData('<nope/>')).toThrow(UpstreamError);
	});
});

describe('parsePlayers', () => {
	it('normalizes every player', () => {
		const { players } = parsePlayers(PLAYERS_XML);
		expect(players).toHaveLength(4);
		expect(players[1]).toEqual({
			id: '100010',
			name: 'Taramiscop',
			alliance: '500708',
			status: expect.objectContaining({ vacation: true, longInactive: true }),
		});
	});

	it('reports no alliance as null', () => {
		expect(parsePlayers(PLAYERS_XML).players[0].alliance).toBeNull();
	});

	it('keeps ids as strings, since they exceed no precision but are keys', () => {
		expect(parsePlayers(PLAYERS_XML).players[0].id).toBe('1');
	});

	it('handles a universe with a single player', () => {
		const xml = '<players timestamp="1"><player id="7" name="Solo"/></players>';
		expect(parsePlayers(xml).players).toHaveLength(1);
	});

	it('handles an empty universe', () => {
		expect(parsePlayers('<players timestamp="1"/>').players).toEqual([]);
	});
});

describe('parsePlayerData', () => {
	it('labels the documented score categories', () => {
		const { scores } = parsePlayerData(PLAYER_DATA_XML);
		expect(scores[0]).toEqual({
			type: 0,
			key: 'total',
			score: 3418739729.891,
			rank: 227,
			ships: null,
		});
		expect(scores[1]).toMatchObject({ key: 'military', ships: 34151 });
	});

	it('passes undocumented categories through without inventing a label', () => {
		const unknown = parsePlayerData(PLAYER_DATA_XML).scores.find((s) => s.type === 20);
		expect(unknown.key).toBeNull();
	});

	it('sorts planets by coordinates', () => {
		const { planets } = parsePlayerData(PLAYER_DATA_XML);
		expect(planets.map((p) => p.coords)).toEqual(['2:194:8', '4:89:8', '4:195:8']);
	});

	it('carries the moons, so universe.xml is not needed', () => {
		const { planets } = parsePlayerData(PLAYER_DATA_XML);
		expect(planets[1].moon).toEqual({ id: '33649938', name: 't3', size: 8602 });
	});

	it('reports a moonless planet as null', () => {
		expect(parsePlayerData(PLAYER_DATA_XML).planets[0].moon).toBeNull();
	});
});

describe('parseAlliances', () => {
	it('normalizes alliances and their members', () => {
		const { alliances } = parseAlliances(ALLIANCES_XML);
		expect(alliances[0]).toEqual({
			id: '500006',
			name: 'Staff OGame',
			tag: 'Staff',
			founder: '100121',
			foundDate: 1592572367,
			homepage: null,
			open: true,
			members: ['100121', '115238'],
		});
	});

	it('reads a missing open attribute as closed', () => {
		expect(parseAlliances(ALLIANCES_XML).alliances[1].open).toBe(false);
	});
});

// Trimmed from the live universe.xml of s282: a self-closed planet, a planet
// with a moon, two planets for one player, and coordinates out of order.
const UNIVERSE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<universe timestamp="1784702404" serverId="fr282"><planet id="1" player="100" name="Arakis" coords="4:212:8"/><planet id="2" player="100" name="Home" coords="1:1:1"><moon id="9" name="" size="8544"/></planet><planet id="3" player="200" name="Solo" coords="2:194:8"/></universe>`;

describe('scanPlanets', () => {
	it('indexes the planets by player', () => {
		const index = scanPlanets(UNIVERSE_XML);
		expect([...index.keys()]).toEqual(['100', '200']);
		expect(index.get('200')).toEqual([{ coords: '2:194:8', moon: false }]);
	});

	it('sorts a player planets by coordinates', () => {
		expect(scanPlanets(UNIVERSE_XML).get('100').map((p) => p.coords)).toEqual([
			'1:1:1',
			'4:212:8',
		]);
	});

	// A self-closed element has no children, so no moon; the moon is the first
	// child of the others.
	it('flags the planet carrying a moon', () => {
		const index = scanPlanets(UNIVERSE_XML);
		expect(index.get('100').find((p) => p.coords === '1:1:1').moon).toBe(true);
		expect(index.get('100').find((p) => p.coords === '4:212:8').moon).toBe(false);
	});

	it('leaves out a player without a planet', () => {
		expect(scanPlanets(UNIVERSE_XML).has('300')).toBe(false);
	});

	// A planet name is free text; XML escapes any quote it contains, so the scan
	// cannot be walked out of an attribute by a crafted name.
	it('is not fooled by a name that looks like an attribute', () => {
		const xml =
			'<universe timestamp="1"><planet id="1" player="7" name="coords=&quot;9:9:9&quot;" coords="3:3:3"/></universe>';
		expect(scanPlanets(xml).get('7')).toEqual([{ coords: '3:3:3', moon: false }]);
	});

	it('rejects a document that is not universe.xml', () => {
		expect(() => scanPlanets('<something-else/>')).toThrow(UpstreamError);
	});
});

describe('universeTimestamp', () => {
	it('reads the generation date of the document', () => {
		expect(universeTimestamp(UNIVERSE_XML)).toBe(1784702404);
	});
});

describe('summarizeAlliance', () => {
	it('trades the member ids for their count', () => {
		const summary = summarizeAlliance(parseAlliances(ALLIANCES_XML).alliances[0]);
		expect(summary.memberCount).toBe(2);
		expect(summary).not.toHaveProperty('members');
		expect(summary.name).toBe('Staff OGame');
	});
});

describe('resolveMembers', () => {
	const [alliance] = parseAlliances(ALLIANCES_XML).alliances;
	const players = [
		{ id: '115238', name: 'Adam', status: decodeStatus('') },
		{ id: '100121', name: 'Zoé', status: decodeStatus('a') },
	];

	it('turns member ids into players and flags the founder', () => {
		const { members, memberCount } = resolveMembers(alliance, players);
		expect(memberCount).toBe(2);
		expect(members[0]).toEqual({
			id: '100121',
			name: 'Zoé',
			status: decodeStatus('a'),
			founder: true,
		});
	});

	// The founder outranks alphabetical order, otherwise "Adam" would lead.
	it('puts the founder first', () => {
		expect(resolveMembers(alliance, players).members.map((m) => m.name)).toEqual(['Zoé', 'Adam']);
	});

	// The two documents are generated minutes apart, so this really happens.
	it('keeps a member that players.xml does not know, at the end', () => {
		const { members, memberCount } = resolveMembers(
			{ ...alliance, members: [...alliance.members, '999'] },
			players,
		);
		expect(memberCount).toBe(3);
		expect(members[2]).toEqual({ id: '999', name: null, status: null, founder: false });
	});
});

describe('normalizeUniverses', () => {
	const servers = [
		{ language: 'fr', number: 198, name: 'Thuban', serverClosed: 0, settings: { economySpeed: 8 } },
		{ language: 'de', number: 100, name: 'Alt', serverClosed: 0 },
		{ language: 'fr', number: 172, name: 'Tucana', serverClosed: 0 },
		{ language: 'fr', number: 5, name: 'Gone', serverClosed: 1 },
	];

	it('drops closed universes', () => {
		expect(normalizeUniverses(servers).map((u) => u.name)).not.toContain('Gone');
	});

	it('sorts by language then number', () => {
		expect(normalizeUniverses(servers).map((u) => `${u.language}${u.number}`)).toEqual([
			'de100',
			'fr172',
			'fr198',
		]);
	});

	it('keeps the settings the lobby already provides', () => {
		const thuban = normalizeUniverses(servers).find((u) => u.number === 198);
		expect(thuban.settings.economySpeed).toBe(8);
	});

	it('defaults missing settings to an empty object', () => {
		const alt = normalizeUniverses(servers).find((u) => u.number === 100);
		expect(alt.settings).toEqual({});
	});
});

describe('matchesSearch', () => {
	it('ignores case', () => {
		expect(matchesSearch('Darth Vader', 'darth')).toBe(true);
	});

	it('ignores accents', () => {
		expect(matchesSearch('Rhéa', 'rhea')).toBe(true);
		expect(matchesSearch('Rhea', 'rhéa')).toBe(true);
	});

	it('matches on a substring', () => {
		expect(matchesSearch('Taramiscop', 'ramis')).toBe(true);
	});

	it('rejects what does not match', () => {
		expect(matchesSearch('Legor', 'zzz')).toBe(false);
	});
});
