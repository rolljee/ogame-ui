// Bilingual copy (FR / EN). Keys are flat, dot-namespaced strings.
// Values may contain {placeholders} replaced by the t() helper.

export const translations = {
	fr: {
		'brand': 'OGame Tools',
		'tagline': 'Outils de calcul pour OGame',

		'nav.label': 'Outils',
		'nav.trader': 'Commerce',
		'nav.moonbreak': 'Destruction de lune',

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

		'mb.title': 'Destruction de lune',
		'mb.intro':
			"Estime tes chances de détruire une lune à l'étoile de la mort, et les pertes que ça va te coûter. Plus la lune est grosse, plus elle est dure à casser — mais plus elle résiste à tes RIP.",

		'mb.step.size': 'Taille de la lune',
		'mb.step.size.help':
			"La taille est visible dans la galaxie, en km. C'est elle qui détermine à la fois tes chances de réussite et le risque de perdre tes RIP.",
		'mb.size.label': 'Taille (km)',
		'mb.size.range': 'Entre {min} km et {max} km.',

		'mb.step.attackers': 'Étoiles de la mort',
		'mb.step.attackers.help':
			'Le nombre de RIP envoyées par chaque attaquant. Chacun répartit sa flotte sur 6 vagues. Jusqu\'à 4 attaquants.',
		'mb.attacker': 'Attaquant {n}',
		'mb.attacker.add': '+ Ajouter un attaquant',
		'mb.attacker.remove': "Retirer l'attaquant {n}",

		'mb.result.title': 'Résultat',
		'mb.result.probability': 'de chances de casser la lune',
		'mb.result.losses': 'Pertes estimées',
		'mb.result.band': 'de chances de perdre entre {min} et {max} RIP',
		'mb.result.mean': 'Pertes moyennes :',

		'mb.waves.uniform': '{waves} vagues de {rip} RIP.',
		'mb.waves.mixed': '{wavesA} vague(s) de {ripA} et {wavesB} vague(s) de {ripB} RIP.',
		'mb.waves.partial': '{waves} vague(s) de 1 RIP.',

		'mb.error.size': 'Entre une taille de lune valide pour voir le résultat.',
		'mb.error.rip': 'Entre le nombre de RIP de chaque attaquant pour voir le résultat.',
		'mb.error.attackers': 'Il faut entre 1 et 4 attaquants.',

		'lang.label': 'Langue',
	},
	en: {
		'brand': 'OGame Tools',
		'tagline': 'Calculators for OGame',

		'nav.label': 'Tools',
		'nav.trader': 'Trade',
		'nav.moonbreak': 'Moonbreak',

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

		'mb.title': 'Moonbreak',
		'mb.intro':
			'Estimate your odds of destroying a moon with Deathstars, and what the attempt will cost you. The bigger the moon, the harder it is to break — but the more of your Deathstars it takes down.',

		'mb.step.size': 'Moon size',
		'mb.step.size.help':
			'The size is shown in the galaxy view, in km. It drives both your chance of success and the risk of losing Deathstars.',
		'mb.size.label': 'Size (km)',
		'mb.size.range': 'Between {min} km and {max} km.',

		'mb.step.attackers': 'Deathstars',
		'mb.step.attackers.help':
			'How many Deathstars each attacker sends. Every attacker splits their fleet over 6 waves. Up to 4 attackers.',
		'mb.attacker': 'Attacker {n}',
		'mb.attacker.add': '+ Add an attacker',
		'mb.attacker.remove': 'Remove attacker {n}',

		'mb.result.title': 'Result',
		'mb.result.probability': 'chance to break the moon',
		'mb.result.losses': 'Estimated losses',
		'mb.result.band': 'chance to lose between {min} and {max} Deathstars',
		'mb.result.mean': 'Average losses:',

		'mb.waves.uniform': '{waves} waves of {rip} Deathstars.',
		'mb.waves.mixed': '{wavesA} wave(s) of {ripA} and {wavesB} wave(s) of {ripB} Deathstars.',
		'mb.waves.partial': '{waves} wave(s) of 1 Deathstar.',

		'mb.error.size': 'Enter a valid moon size to see the result.',
		'mb.error.rip': "Enter each attacker's Deathstar count to see the result.",
		'mb.error.attackers': 'You need between 1 and 4 attackers.',

		'lang.label': 'Language',
	},
};

export const LANGUAGES = [
	{ code: 'fr', label: 'FR' },
	{ code: 'en', label: 'EN' },
];
