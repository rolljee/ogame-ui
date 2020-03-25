import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

import { ROUTES } from './components/constants';

class Home extends React.Component {
	render() {
		return (
			<Row>
				{ROUTES.map(route => (
					<Col>
						<Card bg='dark' text='white' style={{ width: '18rem', height: '10rem' }} className="m-3" key={route.route}>
							<Card.Body>
								<span className="float-right">
									<Button variant="dark" href={route.route}>
										<FontAwesomeIcon icon={faExternalLinkAlt} />
									</Button>
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
