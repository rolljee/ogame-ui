import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { STATUS } from '../../components/constants';

class PlayersStatus extends React.Component {
	constructor(props) {
		super(props);
		this.renderStatus = this.renderStatus.bind(this);
	}
	renderStatus(status, index) {
		const color = this.props.getActiveStatus(status);
		return (
			<Button
				variant={color}
				onClick={() => this.props.setActiveStatus(status)}
				className={`margin-right-sm`} key={index}>
				{STATUS[status]}
			</Button>
		);
	}
	render() {
		return (
			<Row className="text-center">
				<Col>
					{Object.keys(STATUS).map((status, index) => this.renderStatus(status, index))}
				</Col>
			</Row>
		)
	}
}

export default PlayersStatus;
