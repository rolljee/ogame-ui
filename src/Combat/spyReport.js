// Reads an espionage report pasted from the game into the defender's side of
// the form. The report is copied as text, so its layout varies with the
// browser and the game version: rather than following a layout, every known
// label is looked for, with the number that comes right after it.

import Ogame from 'ogamejs';

import { DEFENDER_SHIPS, DEFENSES } from './formulas';

const { Destroyable } = Ogame.models;

// Labels of the game in French and English. Units come from the library.
const RESOURCE_LABELS = {
	metal: ['Métal', 'Metal'],
	crystal: ['Cristal', 'Crystal'],
	deuterium: ['Deutérium', 'Deuterium'],
};

const TECH_LABELS = {
	weapons: ['Technologie Armes', 'Weapons Technology', 'Armes', 'Weapons'],
	shielding: ['Technologie Bouclier', 'Shielding Technology', 'Bouclier', 'Shielding'],
	armour: [
		'Technologie Protection des vaisseaux spatiaux',
		'Protection des vaisseaux spatiaux',
		'Armour Technology',
		'Armor Technology',
		'Protection',
		'Armour',
		'Armor',
	],
};

// Single words that also live inside longer names ("Mine de métal 30"): they
// count only at the start of a line or before a colon.
function isLoose({ part, name }) {
	return part === 'resources' || (part === 'techs' && !/\s/.test(name));
}

// A number as the game writes it: grouped (1.234.567, 1,234,567, 1 234 567)
// or shortened (1,23Mn, 1.2M, 850k, 2Md, 2B).
const NUMBER = String.raw`(\d{1,3}(?:[.,  ]\d{3})+(?!\d)|\d+(?:[.,]\d+)?)[ \t]*(mn|md|bn|[kmb])?(?![\p{L}\d])`;
const SUFFIX = { k: 1e3, m: 1e6, mn: 1e6, b: 1e9, bn: 1e9, md: 1e9 };

function readNumber(digits, suffix) {
	if (!suffix) return Number(digits.replace(/[.,  ]/g, ''));
	return Math.round(Number(digits.replace(',', '.')) * SUFFIX[suffix.toLowerCase()]);
}

function escape(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLabels() {
	const labels = [];
	const add = (part, key, names) => {
		for (const name of names) labels.push({ part, key, name });
	};
	for (const [key, names] of Object.entries(RESOURCE_LABELS)) add('resources', key, names);
	for (const [key, names] of Object.entries(TECH_LABELS)) add('techs', key, names);
	for (const id of DEFENDER_SHIPS) add('ships', id, Object.values(Destroyable[id].names));
	for (const id of DEFENSES) add('defenses', id, Object.values(Destroyable[id].names));
	// Longest first: "Petit bouclier" before "Bouclier".
	return labels.sort((a, b) => b.name.length - a.name.length);
}

const LABELS = buildLabels();
const BY_NAME = new Map(LABELS.map((label) => [label.name.toLowerCase(), label]));
const PATTERN = new RegExp(
	String.raw`(?<![\p{L}])(${LABELS.map(({ name }) => escape(name)).join('|')})(?![\p{L}])([ \t]*:)?\s*` + NUMBER,
	'giu',
);

function isLineStart(text, index) {
	const before = text.slice(text.lastIndexOf('\n', index - 1) + 1, index);
	return before.trim() === '';
}

// Returns what the report shows, as form values (`{ ships, defenses, techs,
// resources }`, each `{ key: '123' }`), or null when nothing was recognised.
export function parseSpyReport(raw) {
	const text = String(raw ?? '')
		.replace(/[’‘`]/g, "'")
		.replace(/\r\n?/g, '\n');
	const found = { ships: {}, defenses: {}, techs: {}, resources: {} };
	let any = false;

	for (const match of text.matchAll(PATTERN)) {
		const [, name, colon, digits, suffix] = match;
		const label = BY_NAME.get(name.toLowerCase());
		if (!label) continue;
		if (isLoose(label) && !colon && !isLineStart(text, match.index)) continue;
		// The first figure wins: a report lists each label once, a later one is
		// something else (a building, a lifeform bonus).
		if (found[label.part][label.key] !== undefined) continue;
		found[label.part][label.key] = String(readNumber(digits, suffix));
		any = true;
	}

	return any ? found : null;
}

// How many entries of each part the report gave, for the import summary.
export function countParts(found) {
	return Object.fromEntries(Object.entries(found).map(([part, values]) => [part, Object.keys(values).length]));
}
