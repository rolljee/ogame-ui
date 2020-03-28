import React from 'react';
import { CORSPROXY, POSITIONS } from '../../components/constants';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

class PlayersDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			planets: [],
			positions: [],
		};

		this.getPlayerData();
	}

	async getPlayerData() {
		const { universe, lang, player } = this.props;
		try {
			const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/playerData.xml?id=${player.id}`;
			const response = await fetch(CORSPROXY + url);
			const text = await response.text();
			const xml = new window.DOMParser().parseFromString(text, "text/xml");
			const positionsXml = xml.getElementsByTagName('position');
			const planetsXml = xml.getElementsByTagName('planet');

			const positions = [];
			for (const position of positionsXml) {
				const type = position.getAttribute('type');
				const score = position.getAttribute('score');
				positions.push({
					type,
					score: this.prettify(score),
					typeLongName: POSITIONS[type]
				});
			}

			const planets = [];
			for (const planet of planetsXml) {
				const coords = planet.getAttribute('coords');
				const [galaxy, system, position] = coords.split(':');
				const planetData = {
					id: planet.getAttribute('id'),
					name: planet.getAttribute('name'),
					coords,
					galaxy,
					system,
					position,
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

			this.setState({ planets, positions });

		} catch (error) {
			console.error(error);
		}
	}

	prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	render() {
		return (
			<>
				<h4 className="text-center">{this.props.player.name}</h4>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Type</th>
							<th>score</th>
						</tr>
					</thead>
					<tbody>
						{this.state.positions.map(positions => (
							<tr key={positions.type} className="clickable">
								<td>{positions.typeLongName}</td>
								<td>{positions.score}</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Coords</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this.state.planets.map(({ id, name, coords, galaxy, system, position }) => (
							<tr key={id} className="clickable">
								<td>{name}</td>
								<td>{coords}</td>
								<td>
									<Button
										variant="primary"
										className="float-right"
										target="_blank"
										href={
											`https://s165-fr.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=${galaxy}&system=${system}&position=${position}`
										}>
										Open in galaxy
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</>
		)
	}
}

export default PlayersDetails;
