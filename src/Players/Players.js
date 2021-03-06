import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import FuzzySearch from 'fuzzy-search';
import PlayersStatus from './components/PlayersStatus';
import { CORSPROXY } from '../components/constants';
import PlayersDetails from './components/PlayerDetails';
import Loading from '../components/Loading';

class Players extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			allPlanets: [],
			lang: "fr",
			loading: true,
			player: {},
			players: [],
			search: '',
			selected: [],
			show: false,
			status: ['A', 'I', 'i'],
			universe: 165,
		};

		this.getActiveStatus = this.getActiveStatus.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleShow = this.handleShow.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setActiveStatus = this.setActiveStatus.bind(this);

		this.init();
	}

	async init() {
		await this.searchPlayers(this.state.lang, this.state.universe)
		await this.searchPlayerPlanets(this.state.lang, this.state.universe)
		this.setState({ loading: false });
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow(player) {
		const { allPlanets } = this.state;
		player.planets = allPlanets
			.filter(planet => planet.player === player.id)
			.sort((a, b) => {
				const gA = a.coords.split(':');
				const gB = b.coords.split(':');
				return gA > gB ? 1 : -1;
			});
		this.setState({ show: true, player });
	}

	handleOnChange(event) {
		const { players } = this.state;
		const search = event.currentTarget.value;
		const searcher = new FuzzySearch(players, ['name']);
		const result = searcher.search(search);
		this.setState({ search, selected: result });
	}

	async searchPlayerPlanets(lang, universe) {
		const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/universe.xml`;
		const response = await fetch(CORSPROXY + url);
		const text = await response.text();
		const xml = new window.DOMParser().parseFromString(text, "text/xml");
		const planetsXml = xml.getElementsByTagName('planet');
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

		this.setState({ allPlanets: planets });
	}

	async searchPlayers(lang, universe) {
		try {
			const url = `https://s${universe}-${lang}.ogame.gameforge.com/api/players.xml`;
			const response = await fetch(CORSPROXY + url);
			const text = await response.text();
			const xml = new window.DOMParser().parseFromString(text, "text/xml")
			const playersXml = xml.getElementsByTagName('player')

			const players = [];
			for (const player of playersXml) {
				const id = player.getAttribute('id');
				const name = player.getAttribute('name');
				const status = player.getAttribute('status') || 'A'; // by default Active user does not have any status

				players.push({ id, name, status });
			}

			this.setState({ players, lang, universe }, this.refreshPlayers);
		} catch (error) {
			console.error(error);
		}
	}

	async updateList(lang, universe) {
		await this.searchPlayerPlanets(lang, universe);
		await this.searchPlayers(lang, universe);
		this.setState({ loading: false });
	}

	async handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();
		const lang = event.currentTarget.lang.value;
		const universe = event.currentTarget.universe.value;

		this.setState({ loading: true }, () => {
			this.updateList(lang, universe)
		});
	}

	getActiveStatus(status) {
		return this.state.status.includes(status) ? 'primary' : 'light';
	}

	setActiveStatus(selectedStatus) {
		const status = this.state.status.includes(selectedStatus) ?
			this.state.status.filter(s => s !== selectedStatus)
			: [...this.state.status, ...selectedStatus];

		if (!status.length) {
			// Avoid user to remove all filters
			status.push(selectedStatus);
		}
		this.setState({ status }, this.refreshPlayers);
	}

	refreshPlayers() {
		const { status, players, search } = this.state;
		const playerRegex = new RegExp(search);
		const selected = players.filter(player => status.includes(player.status));
		this.setState({ selected: selected.filter(s => playerRegex.exec(s)) });
	}

	render() {
		return (
			<>
				{!this.state.loading ? (
					<Row>
						<Col sm={12}>
							<Form onSubmit={this.handleSubmit} className="m-4">
								<Row className="w-100 justify-content-center">
									<Col xs="auto">
										<Form.Control type="number" name="universe" placeholder="universe" size="sm" />
									</Col>
									<Col xs="auto">
										<Form.Control type="text" name="lang" placeholder="fr" size="sm" />
									</Col>
									<Col xs="auto">
										<Button variant="light" type="submit">Submit</Button>
									</Col>
								</Row>
							</Form>
						</Col>
						<Col sm={12}>
							<h4 className="text-white text-center">{this.state.lang} - {this.state.universe}</h4>
							<PlayersStatus
								getActiveStatus={this.getActiveStatus}
								setActiveStatus={this.setActiveStatus}
							/>
							<Row className="m-2">
								<Col>
									<Form.Control placeholder="Search by player's name" onChange={this.handleOnChange} />
								</Col>
							</Row>
							<Table striped bordered hover variant="dark">
								<thead>
									<tr>
										<th>Name</th>
										<th>Status</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{this.state.selected.map(player => (
										<tr key={player.id} className="clickable">
											<td>{player.name}</td>
											<td>{player.status}</td>
											<td>
												<Button variant="primary" onClick={() => this.handleShow(player)}>
													Open details
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Col>

						<Modal show={this.state.show} onHide={this.handleClose} animation={false}>
							<Modal.Header closeButton>
								<Modal.Title>Player details</Modal.Title>
							</Modal.Header>

							<Modal.Body>
								<PlayersDetails player={this.state.player} lang={this.state.lang} universe={this.state.universe} />
							</Modal.Body>
						</Modal>
					</Row>
				) : <Loading />}
			</>
		)
	}
}

export default Players;
