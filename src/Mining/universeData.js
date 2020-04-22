import { CORSPROXY } from '../components/constants';
import parser from 'xml2js';

export async function getUniverseData(universe, lang) {
	const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/serverData.xml`;
	const response = await fetch(CORSPROXY + url);
	const text = await response.text();
	const result = await parser.parseStringPromise(text);
	console.log(result);

	const finalObj = {};

	for (const key of Object.keys(result.serverData)) {
		if (key !== '$') {
			finalObj[key] = result.serverData[key][0];
		}
	}
	return finalObj;
}
