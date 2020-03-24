import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from './Header';

class Layout extends React.Component {
	render() {
		return (
			<>
				<Header />
				<Container fluid className="full-height">
					<Container>
						<Row>
							<Col>{this.props.children}</Col>
						</Row>
					</Container>
				</Container>
			</>
		);
	}
}

export default Layout;
