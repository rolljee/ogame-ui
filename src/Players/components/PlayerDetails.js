import React from 'react';
import { CORSPROXY, POSITIONS } from '../../components/constants';
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Planet from './planet.png';
import Moon from './moon.gif';

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

	link(galaxy, system, position) {
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
				<Row>
					{this.state.planets.map(({ id, name, coords, galaxy, system, position, moon }) => (
						<Col xs={12} key={id}>
							<Col>
								<Row>
									<Col>
										<Image src={Planet} roundedCircle />
										<small className="ml-1"><a href={this.link(galaxy, system, position)}>{coords}</a></small><br />
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