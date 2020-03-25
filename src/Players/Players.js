import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import PlayersStatus from './components/PlayersStatus';
import { STATUS, CORSPROXY } from '../components/constants';
import PlayersDetails from './components/PlayerDetails';

class Players extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: "fr",
			player: {},
			players: [],
			selected: [],
			show: false,
			status: Object.keys(STATUS),
			universe: 165,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.getActiveStatus = this.getActiveStatus.bind(this);
		this.setActiveStatus = this.setActiveStatus.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleShow = this.handleShow.bind(this);
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow(player) {
		this.setState({ show: true, player });
	}


	async handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		try {
			const lang = event.currentTarget.lang.value;
			const universe = event.currentTarget.universe.value;
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

			this.setState({ selected: players, players, lang, universe });
		} catch (error) {
			console.error(error);
		}
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
		const { status, players } = this.state;
		const selected = players.filter(player => new RegExp(`[${status.join('')}]+`).test(player.status));
		this.setState({ selected });
	}

	render() {
		return (
			<Row>
				<Col sm={12}>
					<Form onSubmit={this.handleSubmit} className="m-4">
						<Row className="w-100 justify-content-center">
							<Col xs="auto">
								<Form.Control type="number" name="universe" placeholder="universe" size="sm" defaultValue="165" />
							</Col>
							<Col xs="auto">
								<Form.Control type="text" name="lang" placeholder="fr" size="sm" defaultValue="fr" />
							</Col>
							<Col xs="auto">
								<Button variant="light" type="submit">Submit</Button>
							</Col>
						</Row>
					</Form>
				</Col>
				<Col sm={12}>
					{this.state.selected.length && (
						<>
							<PlayersStatus
								getActiveStatus={this.getActiveStatus}
								setActiveStatus={this.setActiveStatus}
							/>
							<Table striped bordered hover variant="dark">
								<thead>
									<tr>
										<th>Name</th>
										<th>Status</th>
										<th>id</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{this.state.selected.map(player => (
										<tr key={player.id} className="clickable">
											<td>{player.name}</td>
											<td>{player.status}</td>
											<td>{player.id}</td>
											<td>
												<Button variant="primary" onClick={() => this.handleShow(player)}>
													Open details
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</>
					)}
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
		)
	}
}

export default Players;
