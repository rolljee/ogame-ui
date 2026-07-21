import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class Universe extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
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
			</Row>
		)
	}
}

export default Universe;
