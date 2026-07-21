import { CORSPROXY } from '../components/constants';

export async function getUniverseData(universe, lang) {
	const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/serverData.xml`;
	const response = await fetch(CORSPROXY + url);
	const text = await response.text();
	const xml = new window.DOMParser().parseFromString(text, "text/xml");
	const root = xml.getElementsByTagName('serverData')[0] || xml.documentElement;

	const finalObj = {};

	for (const child of root.children) {
		finalObj[child.tagName] = child.textContent;
	}
	return finalObj;
}
