import React from 'react';
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import unionBy from 'lodash/unionBy';

import Planet from '../../images/planet.png';
import Moon from '../../images/moon.gif';
import { CORSPROXY, POSITIONS } from '../../components/constants';

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
				const ships = position.getAttribute('ships');
				const pos = position.textContent;
				positions.push({
					type,
					score: this.prettify(score),
					typeLongName: POSITIONS[type],
					pos,
					ships
				});
			}

			const planets = [];
			for (const planet of planetsXml) {
				const data = {
					id: planet.getAttribute('id'),
					name: planet.getAttribute('name'),
					player: planet.getAttribute('player'),
					coords: planet.getAttribute('coords'),
				}

				const moon = planet.getElementsByTagName('moon')[0];

				if (moon) {
					data.moon = {
						id: moon.getAttribute('id'),
						name: moon.getAttribute('name'),
						size: moon.getAttribute('size'),
					}
				}

				planets.push(data);
			}

			this.setState({ positions, planets: unionBy(player.planets, planets, 'id') });

		} catch (error) {
			console.error(error);
		}
	}

	prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	link(coords) {
		const [galaxy, system, position] = coords.split(':');
		return `https://s165-fr.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=${galaxy}&system=${system}&position=${position}`;
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
							<th>position</th>
						</tr>
					</thead>
					<tbody>
						{this.state.positions.map(positions => (
							<tr key={positions.type} className="clickable">
								<td>{positions.typeLongName}</td>
								<td>{positions.score}</td>
								<td>{positions.pos} {positions.ships && (
									<span className="float-right"> <span role="img" aria-labelledby="death">☠️</span> {positions.ships}</span>
								)}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Row>
					{this.state.planets.map(({ id, name, coords, moon }) => (
						<Col xs={12} key={id}>
							<Col>
								<Row>
									<Col>
										<Image src={Planet} roundedCircle />
										<small className="ml-1"><a href={this.link(coords)} target="_blank" rel="noopener noreferrer">{coords}</a></small><br />
									</Col>
									<Col>
										<small>{name}</small>
									</Col>
									<Col>
										{moon && (
											<>
												<Image src={Moon} roundedCircle />
												<small className="ml-1">size: {moon.size}</small>
											</>
										)}
									</Col>
								</Row>
							</Col>
						</Col>
					))}
				</Row>
			</>
		)
	}
}

export default PlayersDetails;
