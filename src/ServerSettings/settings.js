// Presentation model for a universe's settings.
//
// serverData.xml carries well over a hundred fields; this picks the ones players
// actually ask about and groups them. Formatting stays pure so it can be tested
// without rendering anything.

export const SETTING_GROUPS = [
	{
		key: 'universe',
		titleKey: 'srv.group.universe',
		rows: [
			{ key: 'version', labelKey: 'srv.version', format: 'text' },
			{ key: 'galaxies', labelKey: 'srv.galaxies', format: 'integer' },
			{ key: 'systems', labelKey: 'srv.systems', format: 'integer' },
			{ key: 'bonusFields', labelKey: 'srv.bonusFields', format: 'integer' },
			{ key: 'donutGalaxy', labelKey: 'srv.donutGalaxy', format: 'bool' },
			{ key: 'donutSystem', labelKey: 'srv.donutSystem', format: 'bool' },
			{ key: 'timezone', labelKey: 'srv.timezone', format: 'text' },
		],
	},
	{
		key: 'speed',
		titleKey: 'srv.group.speed',
		rows: [
			{ key: 'speed', labelKey: 'srv.speed', format: 'multiplier' },
			{ key: 'speedFleetPeaceful', labelKey: 'srv.fleetPeaceful', format: 'multiplier' },
			{ key: 'speedFleetWar', labelKey: 'srv.fleetWar', format: 'multiplier' },
			{ key: 'speedFleetHolding', labelKey: 'srv.fleetHolding', format: 'multiplier' },
			{ key: 'researchDurationDivisor', labelKey: 'srv.research', format: 'divisor' },
		],
	},
	{
		key: 'combat',
		titleKey: 'srv.group.combat',
		rows: [
			{ key: 'debrisFactor', labelKey: 'srv.debris', format: 'percent' },
			{ key: 'debrisFactorDef', labelKey: 'srv.debrisDef', format: 'percent' },
			{ key: 'deuteriumInDebris', labelKey: 'srv.deutInDebris', format: 'bool' },
			{ key: 'repairFactor', labelKey: 'srv.repair', format: 'percent' },
			{ key: 'defToTF', labelKey: 'srv.defToTF', format: 'bool' },
			{ key: 'acs', labelKey: 'srv.acs', format: 'bool' },
			{ key: 'rapidFire', labelKey: 'srv.rapidFire', format: 'bool' },
			{ key: 'bashlimit', labelKey: 'srv.bashlimit', format: 'integer' },
		],
	},
	{
		key: 'economy',
		titleKey: 'srv.group.economy',
		rows: [
			{ key: 'topScore', labelKey: 'srv.topScore', format: 'integer' },
			{ key: 'globalDeuteriumSaveFactor', labelKey: 'srv.deutSave', format: 'percent' },
			{ key: 'probeCargo', labelKey: 'srv.probeCargo', format: 'bool' },
			{
				key: 'cargoHyperspaceTechMultiplier',
				labelKey: 'srv.hyperspaceCargo',
				format: 'percentPerLevel',
			},
			{ key: 'marketplaceEnabled', labelKey: 'srv.marketplace', format: 'bool' },
			{ key: 'tradeRatio', labelKey: 'srv.tradeRatio', format: 'text' },
		],
	},
];

// Group thousands with dots, the way OGame itself does.
export function groupDigits(value) {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Trailing zeros are noise on a rate like 2.5 : 1.5 : 1.
function trim(value) {
	return String(Number(value));
}

// The merchant's official rate lives in three separate fields; players want it
// as one ratio they can paste into the trade calculator.
export function tradeRatio(data) {
	const metal = data.marketplaceBasicTradeRatioMetal;
	const crystal = data.marketplaceBasicTradeRatioCrystal;
	const deut = data.marketplaceBasicTradeRatioDeuterium;
	if ([metal, crystal, deut].some((value) => value === undefined || value === null)) {
		return null;
	}
	return `${trim(metal)} : ${trim(crystal)} : ${trim(deut)}`;
}

// Returns null for booleans: only the component can translate yes/no.
export function formatSetting(value, format) {
	switch (format) {
		case 'multiplier':
			return `×${trim(value)}`;
		case 'divisor':
			return `÷${trim(value)}`;
		case 'percent':
			return `${trim(Math.round(Number(value) * 1000) / 10)} %`;
		case 'percentPerLevel':
			return `${trim(value)} %`;
		case 'integer':
			return groupDigits(Math.round(Number(value)));
		case 'bool':
			return null;
		default:
			return String(value);
	}
}

// Drops any row the universe does not report, so a missing field never renders
// as "undefined".
export function describeServer(data) {
	if (!data) return [];

	const enriched = { ...data, tradeRatio: tradeRatio(data) };

	return SETTING_GROUPS.map((group) => ({
		...group,
		rows: group.rows.filter((row) => {
			const value = enriched[row.key];
			return value !== undefined && value !== null && value !== '';
		}).map((row) => ({ ...row, value: enriched[row.key] })),
	})).filter((group) => group.rows.length > 0);
}
