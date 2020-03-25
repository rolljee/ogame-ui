import React from 'react';
import { CORSPROXY } from '../../components/constants';

class PlayersDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.getPlayerData();
	}

	async getPlayerData() {
		const { universe, lang, player } = this.props;
		try {
			const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/playerData.xml?id=${player.id}`;
			const response = await fetch(CORSPROXY + url);
			const text = await response.text();
			const xml = new window.DOMParser().parseFromString(text, "text/xml");
			console.log(xml);
			const positionsXml = xml.getElementsByTagName('position');
			const planetsXml = xml.getElementsByTagName('planet');

			const positions = [];
			for (const position of positionsXml) {
				console.log(position);
				const type = position.getAttribute('type');
				const score = position.getAttribute('score');
				positions.push({ type, score });
			}

			const planets = [];
			for (const planet of planetsXml) {
				const planetData = {
					id: planet.getAttribute('id'),
					name: planet.getAttribute('name'),
					coords: planet.getAttribute('coords')
				}

				const moon = planet.getElementsByTagName('moon')[0];
				if (moon) {
					planetData.moon = {
						id: moon.getAttribute('id'),
						name: moon.getAttribute('name'),
						size: moon.getAttribute('size')
					}
				}

				planets.push(planetData);
			}

			console.log(planets, positions);

		} catch (error) {
			console.error(error);
		}
	}

	render() {
		return (
			<h1>Toto</h1>
		)
	}
}

export default PlayersDetails;
