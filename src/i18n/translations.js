// Bilingual copy (FR / EN). Keys are flat, dot-namespaced strings.
// Values may contain {placeholders} replaced by the t() helper.

export const translations = {
	fr: {
		'brand': 'OGame Tools',
		'tagline': "Calculateur d'échange de ressources",

		'calc.title': 'Calculateur de commerce',
		'calc.intro':
			"Convertis une ressource en une autre grâce au commerçant. Choisis ce que tu veux échanger, la quantité, le taux et la répartition : le résultat se calcule tout seul.",

		'step.resource': 'Ressource à échanger',
		'step.resource.help': 'Choisis la ressource que tu veux convertir.',

		'step.amount': 'Quantité à échanger',
		'step.amount.help': 'Combien de cette ressource veux-tu échanger ?',

		'step.rate': "Taux d'échange",
		'step.rate.help':
			"Le taux compare la valeur des ressources (métal : cristal : deutérium). Par exemple 2 : 1,5 : 1 signifie que 2 métal ou 1,5 cristal valent 1 deutérium.",
		'step.rate.presets': 'Taux courants',
		'step.rate.custom': 'Taux personnalisé',

		'step.split': 'Répartition du résultat',
		'step.split.help':
			'Répartis ce que tu reçois entre les deux autres ressources. Le total fait toujours 100 %.',

		'result.title': 'Tu obtiens',
		'result.empty': 'Entre une quantité pour voir le résultat.',
		'result.for': 'En échange de',
		'result.copy': 'Copier le récapitulatif',
		'result.copied': 'Copié !',

		'resource.metal': 'Métal',
		'resource.crystal': 'Cristal',
		'resource.deut': 'Deutérium',

		'copy.trade': 'Échange',
		'copy.against': 'Contre',

		'lang.label': 'Langue',
	},
	en: {
		'brand': 'OGame Tools',
		'tagline': 'Resource exchange calculator',

		'calc.title': 'Trade calculator',
		'calc.intro':
			'Convert one resource into another through the merchant. Pick what you want to trade, the amount, the rate and the split: the result is computed automatically.',

		'step.resource': 'Resource to trade',
		'step.resource.help': 'Pick the resource you want to convert.',

		'step.amount': 'Amount to trade',
		'step.amount.help': 'How much of this resource do you want to trade?',

		'step.rate': 'Exchange rate',
		'step.rate.help':
			'The rate compares the value of resources (metal : crystal : deuterium). For example 2 : 1.5 : 1 means 2 metal or 1.5 crystal are worth 1 deuterium.',
		'step.rate.presets': 'Common rates',
		'step.rate.custom': 'Custom rate',

		'step.split': 'Split the result',
		'step.split.help':
			'Split what you receive between the two other resources. The total is always 100%.',

		'result.title': 'You get',
		'result.empty': 'Enter an amount to see the result.',
		'result.for': 'In exchange for',
		'result.copy': 'Copy summary',
		'result.copied': 'Copied!',

		'resource.metal': 'Metal',
		'resource.crystal': 'Crystal',
		'resource.deut': 'Deuterium',

		'copy.trade': 'Trade',
		'copy.against': 'Against',

		'lang.label': 'Language',
	},
};

export const LANGUAGES = [
	{ code: 'fr', label: 'FR' },
	{ code: 'en', label: 'EN' },
];
