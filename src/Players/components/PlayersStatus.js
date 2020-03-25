import React from 'react';
import Button from 'react-bootstrap/Button';
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
				{status}
			</Button>
		);
	}
	render() {
		return Object.keys(STATUS).map((status, index) => this.renderStatus(status, index));
	}
}

export default PlayersStatus;
