import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

import Ogame from 'ogamejs';
import { MINES } from '../components/constants';
import MetalMine from './components/MetalMine';
import CrystalMine from './components/CrystalMine';
import DeutSynth from './components/DeutSynth';

function Mining() {
	const [show, setShow] = useState(false);
	const [infocompte, setInfocompte] = useState({});
	const [universeData, setUniverseData] = useState({});

	async function getUniverseData() {

	}

	async function handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		const lang = event.currentTarget.lang.value;
		const universe = event.currentTarget.universe.value;
		const data = event.currentTarget.infocompte.value;

		const parsedData = Ogame.Building.parseInfoCompteData(data);
		const toKeep = { lang, universe, ...parsedData };

		setInfocompte(toKeep);
		const universeData = await getUniverseData(universe, lang);
		setUniverseData(universeData);
		localStorage.setItem('og_ui_infocompte', JSON.stringify(parsedData));
	}

	useEffect(function persistInfocompte() {
		const data = localStorage.getItem('og_ui_infocompte');
		if (data) {
			setInfocompte(JSON.parse(data));
		}
	}, [])

	return (
		<>
			<FontAwesomeIcon icon={faCog} className="text-white float-right m-2" onClick={() => setShow(true)} />
			<Table responsive striped bordered hover variant="dark">
				<thead>
					<tr>
						<th>Planet list</th>
						{MINES.map((mine, index) => (
							<th key={index}>
								<img src={mine.img} alt={mine.name} width="60" height="60" />
							</th>
						))}
						<th>Energy tech</th>
						<th>Energy total</th>
					</tr>
				</thead>
				<tbody>
					{infocompte && infocompte.planets && infocompte.planets.map((planet, index) => (
						<tr key={index}>
							<th>
								<p>{planet.planet}</p>
							</th>
							<th>
								<MetalMine universeData={universeData} planet={planet} />
							</th>
							<th>
								<CrystalMine universeData={universeData} planet={planet} />
							</th>
							<th>
								<DeutSynth universeData={universeData} planet={planet} />
							</th>
							<th>5</th>
							<th>6</th>
							<th>7</th>
							<th>8</th>
						</tr>
					))}
				</tbody>
			</Table>

			<Modal show={show} onHide={() => setShow(false)} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>Import infocompte data</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form onSubmit={(e) => handleSubmit(e)}>
						<p>Ces données servent à récupérer la vitesse de l'univers pour les calculs</p>
						<Row>
							<Col xs="auto">
								<Form.Control type="number" name="universe" placeholder="universe" size="sm" defaultValue={infocompte.universe} />
							</Col>
							<Col xs="auto">
								<Form.Control type="text" name="lang" placeholder="fr" size="sm" defaultValue={infocompte.lang} />
							</Col>
						</Row>
						<Row className="mt-2">
							<Col>
								<Form.Group controlId="infocompte">
									<Form.Label>Infocompte bb-code</Form.Label>
									<Form.Control as="textarea" name="infocompte" rows="3" />
								</Form.Group>
								<Button variant="primary" type="submit">Submit</Button>
							</Col>
						</Row>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}


export default Mining;
