import React from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { ROUTES } from './components/constants';

class Home extends React.Component {
	render() {
		return (
			<Row>
				{ROUTES.map(route => (
					<Col>
						<a href={`/${route.route}`}>
							<Card bg='dark' text='white' style={{ width: '18rem' }} className="m-3">
								<Card.Header>{route.header}</Card.Header>
								<Card.Body>
									<Card.Title>{route.title}</Card.Title>
									<Card.Text>
										{route.text}
									</Card.Text>
								</Card.Body>
							</Card>
						</a>
					</Col>
				))
				}
			</Row>
		)
	}
}

export default Home;
