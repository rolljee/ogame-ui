import Crystal from '../images/crystal.png';
import Metal from '../images/metal.png';
import Synth from '../images/synth.png';
import solarPlant from '../images/solarPlant.png';
import fusionReactor from '../images/fusionReactor.png';

export const BACKGROUND = {
	light: 'light',
	dark: 'dark',
};

export const CORSPROXY = "https://api.codetabs.com/v1/proxy?quest=";

export const POSITIONS = {
	0: 'All',
	1: "Economy",
	2: "Research",
	3: "Military",
	4: "Military Built",
	5: "Military Destroyed",
	6: "Military Lost",
	7: "Honor",
}

export const RATES = [
	{
		rate: '2.5:1.6:1',
	},
	{
		rate: '2:1.5:1',
	},
	{
		rate: '1.8:1.4:1',
	},
];

export const MINES = [
	{ name: 'metal', img: Metal },
	{ name: 'crystal', img: Crystal },
	{ name: 'synth', img: Synth },
	{ name: 'solarPlant', img: solarPlant },
	{ name: 'fusionReactor', img: fusionReactor }
];

export const RESOURCES = {
	crystal: 'crystal',
	deut: 'deut',
	metal: 'metal',
};

export const STATUS = {
	A: 'active', // GF take no status as an active player
	a: 'admin',
	v: 'vacancy',
	i: 'inactive',
	I: 'long inactive',
	b: 'banned',
	o: 'outlaw'
}

export const ROUTES = [
	{
		header: 'Trades',
		title: 'Trades resources',
		text: 'Get value of resources to sell your resource',
		route: 'trades',
		available: true
	},
	{
		header: 'Players',
		title: 'Players list',
		text: 'Get players accross universes',
		route: 'players',
		available: true
	},
	{
		header: 'Market',
		title: 'Market resources calculator',
		text: 'Get value of ship/resources for the market',
		route: 'market',
		available: false
	},
	{
		header: 'Mining',
		title: 'Building tool',
		text: 'Get the production/cost of any building',
		route: 'mining',
		available: true
	},
]
