import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

import { ROUTES } from './constants';

class Home extends React.Component {
	render() {
		return (
			<Row>
				{ROUTES.map((route, index) => (
					<Col key={index} sm={6}>
						<Card bg='dark' text='white' style={{ width: '18rem', height: '10rem' }} className="m-3" key={route.route}>
							<Card.Body>
								<span className="float-right">
									{route.available ?
										(
											<Link to={route.route}>
												<Button variant="dark">
													<FontAwesomeIcon icon={faExternalLinkAlt} />
												</Button>
											</Link>
										)
										:
										'Bientôt disponible'
									}
								</span>
								<Card.Title>
									{route.title}
								</Card.Title>
								<Card.Text>
									{route.text}
								</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))
				}
			</Row>
		)
	}
}

export default Home;
