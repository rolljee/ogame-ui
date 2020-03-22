import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import NumberIntput from './NumberInput';
import { RESOURCES } from './constants';

class RateInputs extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{ id: RESOURCES.metal },
			{ id: RESOURCES.crystal },
			{ id: RESOURCES.deut },
		];
	}

	renderInputs(resource, index) {
		const current = RESOURCES[resource.id];
		return (
			<Col key={index}>
				<NumberIntput
					text={current}
					onChange={e => this.props.handleRateChange(e, current)}
					placeholder={current}
					value={this.props.getRate(current)}
				/>
			</Col>
		);
	}

	render() {
		return (
			<Row>
				{this.resources.map((resource, index) => this.renderInputs(resource, index))}
			</Row>
		)
	}
}

export default RateInputs;
