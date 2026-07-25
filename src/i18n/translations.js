// Bilingual copy (FR / EN). Keys are flat, dot-namespaced strings.
// Values may contain {placeholders} replaced by the t() helper.

export const translations = {
	fr: {
		'brand': 'OGame Tools',
		'tagline': 'Outils de calcul pour OGame',

		'nav.label': 'Outils',
		'nav.trader': 'Commerce',
		'nav.moonbreak': 'Destruction de lune',
		'nav.server': 'Réglages serveur',

		'common.yes': 'Oui',
		'common.no': 'Non',

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

		'srv.intro':
			"Les réglages d'un univers : vitesses, débris, taille de la galaxie, score du premier. Utile pour savoir à quoi s'attendre avant de s'y installer, ou pour régler les autres calculateurs.",

		'srv.step.universe': 'Choisir un univers',
		'srv.step.universe.help':
			"Choisis ta communauté puis ton univers. La liste vient directement de Gameforge : seuls les univers encore ouverts apparaissent.",
		'srv.language': 'Communauté',
		'srv.universe': 'Univers',
		'srv.subtitle': 'Univers {number} · {lang}',
		'srv.unnamed': 'Univers {number}',

		'srv.loadingUniverses': 'Chargement de la liste des univers…',
		'srv.loading': 'Chargement des réglages…',
		'srv.error.universes': 'Impossible de charger la liste des univers.',
		'srv.error.data': 'Impossible de charger les réglages de cet univers.',

		'srv.group.universe': 'Univers',
		'srv.group.speed': 'Vitesses',
		'srv.group.combat': 'Combat et débris',
		'srv.group.economy': 'Économie',

		'srv.version': 'Version du jeu',
		'srv.galaxies': 'Nombre de galaxies',
		'srv.systems': 'Systèmes par galaxie',
		'srv.bonusFields': 'Cases supplémentaires',
		'srv.donutGalaxy': 'Galaxies cycliques',
		'srv.donutSystem': 'Systèmes cycliques',
		'srv.timezone': 'Fuseau horaire',

		'srv.speed': "Vitesse d'économie",
		'srv.fleetPeaceful': 'Vitesse de flotte (paix)',
		'srv.fleetWar': 'Vitesse de flotte (guerre)',
		'srv.fleetHolding': 'Vitesse de flotte (retenue)',
		'srv.research': 'Durée de recherche',

		'srv.debris': 'Débris des vaisseaux',
		'srv.debrisDef': 'Débris des défenses',
		'srv.deutInDebris': 'Deutérium dans les débris',
		'srv.repair': 'Réparation du bouclier',
		'srv.defToTF': 'Défenses réparables',
		'srv.acs': 'Attaque groupée (AGR)',
		'srv.rapidFire': 'Feu rapide',
		'srv.bashlimit': 'Limite de bash',

		'srv.topScore': 'Score du premier',
		'srv.deutSave': 'Consommation de deutérium',
		'srv.probeCargo': 'Fret dans les sondes',
		'srv.hyperspaceCargo': 'Fret par niveau d\'hyperespace',
		'srv.marketplace': 'Place de marché',
		'srv.tradeRatio': "Taux d'échange officiel",

		'lang.label': 'Langue',
	},
	en: {
		'brand': 'OGame Tools',
		'tagline': 'Calculators for OGame',

		'nav.label': 'Tools',
		'nav.trader': 'Trade',
		'nav.moonbreak': 'Moonbreak',
		'nav.server': 'Server settings',

		'common.yes': 'Yes',
		'common.no': 'No',

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

		'srv.intro':
			"A universe's settings: speeds, debris, galaxy size, top score. Handy to know what you are getting into before settling in, or to configure the other calculators.",

		'srv.step.universe': 'Pick a universe',
		'srv.step.universe.help':
			'Pick your community, then your universe. The list comes straight from Gameforge: only universes that are still open show up.',
		'srv.language': 'Community',
		'srv.universe': 'Universe',
		'srv.subtitle': 'Universe {number} · {lang}',
		'srv.unnamed': 'Universe {number}',

		'srv.loadingUniverses': 'Loading the universe list…',
		'srv.loading': 'Loading settings…',
		'srv.error.universes': 'Could not load the universe list.',
		'srv.error.data': 'Could not load this universe’s settings.',

		'srv.group.universe': 'Universe',
		'srv.group.speed': 'Speeds',
		'srv.group.combat': 'Combat and debris',
		'srv.group.economy': 'Economy',

		'srv.version': 'Game version',
		'srv.galaxies': 'Galaxies',
		'srv.systems': 'Systems per galaxy',
		'srv.bonusFields': 'Bonus fields',
		'srv.donutGalaxy': 'Wrapping galaxies',
		'srv.donutSystem': 'Wrapping systems',
		'srv.timezone': 'Time zone',

		'srv.speed': 'Economy speed',
		'srv.fleetPeaceful': 'Fleet speed (peaceful)',
		'srv.fleetWar': 'Fleet speed (war)',
		'srv.fleetHolding': 'Fleet speed (holding)',
		'srv.research': 'Research duration',

		'srv.debris': 'Ship debris',
		'srv.debrisDef': 'Defence debris',
		'srv.deutInDebris': 'Deuterium in debris',
		'srv.repair': 'Shield repair',
		'srv.defToTF': 'Repairable defences',
		'srv.acs': 'Combined attack (ACS)',
		'srv.rapidFire': 'Rapid fire',
		'srv.bashlimit': 'Bashing limit',

		'srv.topScore': 'Top score',
		'srv.deutSave': 'Deuterium consumption',
		'srv.probeCargo': 'Cargo on probes',
		'srv.hyperspaceCargo': 'Cargo per hyperspace level',
		'srv.marketplace': 'Marketplace',
		'srv.tradeRatio': 'Official exchange rate',

		'lang.label': 'Language',
	},
};

export const LANGUAGES = [
	{ code: 'fr', label: 'FR' },
	{ code: 'en', label: 'EN' },
];
