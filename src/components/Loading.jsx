import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Loading() {
	return (
		<Row className="text-center mt-4">
			<Col>
				<h4 className="text-white">Loading...</h4>
			</Col>
		</Row>
	)
}

export default Loading;
