import { faCog, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Ogame from 'ogamejs';
import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';

import { getUniverseData } from './universeData';
import { MINES } from '../components/constants';
import CrystalMine from './components/CrystalMine';
import DeutSynth from './components/DeutSynth';
import MetalMine from './components/MetalMine';

function Mining() {
	const [show, setShow] = useState(false);
	const [edit, setEdit] = useState(false);
	const [infocompte, setInfocompte] = useState({});
	const [universeData, setUniverseData] = useState({});

	async function handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		const data = event.currentTarget.infocompte.value;
		const parsedData = Ogame.Building.parseInfoCompteData(data);
		const universeData = await getUniverseData(parsedData.universe, parsedData.lang);
		
		setInfocompte(parsedData);
		setUniverseData(universeData);
		localStorage.setItem('og_ui_infocompte', JSON.stringify(parsedData));
		localStorage.setItem('og_ui_universeData', JSON.stringify(universeData));
	}

	useEffect(function persistInfocompte() {
		const data = localStorage.getItem('og_ui_infocompte');
		if (data) {
			setInfocompte(JSON.parse(data));
		}
	}, [])

	useEffect(function persistInfocompte() {
		const data = localStorage.getItem('og_ui_universeData');
		if (data) {
			console.log(JSON.parse(data));
			setUniverseData(JSON.parse(data));
		}
	}, [])

	return (
		<>
			<FontAwesomeIcon icon={faCog} className="text-white float-right m-2" onClick={() => setShow(true)} />
			<FontAwesomeIcon icon={faEdit} className="text-white float-right m-2" onClick={() => setEdit(!edit)} />
			<Table responsive striped bordered hover variant="dark">
				<thead>
					<tr>
						<th></th>
						{MINES.map((mine, index) => (
							<th key={index}>
								<img src={mine.img} alt={mine.name} width="60" height="60" />
							</th>
						))}
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
							<th>{edit ? 'edit' : 'Pas edit'}</th>
							<th>{edit ? 'edit' : 'Pas edit'}</th>
							<th>{edit ? 'edit' : 'Pas edit'}</th>
							<th>Total</th>
						</tr>
					))}
				</tbody>
			</Table>

			<Modal show={show} onHide={() => setShow(false)} animation={false}>
				<Modal.Header closeButton>
					<Modal.Title>Import des données infocompte</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form onSubmit={(e) => handleSubmit(e)}>
						<Row className="mt-2">
							<Col>
								<Form.Group controlId="infocompte">
									<Form.Label>Donnée infocompte sans le bb-code</Form.Label>
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
