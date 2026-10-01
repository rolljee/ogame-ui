import { RESOURCES } from '../components/constants';

// Per-resource presentation metadata: canonical color + i18n label key.
// `order` is the metal:crystal:deut order used throughout the UI and rates.
export const RESOURCE_META = {
	[RESOURCES.metal]: { key: 'metal', color: 'var(--metal)', labelKey: 'resource.metal' },
	[RESOURCES.crystal]: { key: 'crystal', color: 'var(--crystal)', labelKey: 'resource.crystal' },
	[RESOURCES.deut]: { key: 'deut', color: 'var(--deut)', labelKey: 'resource.deut' },
};

export const RESOURCE_ORDER = [RESOURCES.metal, RESOURCES.crystal, RESOURCES.deut];

export function prettify(x) {
	return Number(x || 0)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // dot thousands separator (OGame style)
}
