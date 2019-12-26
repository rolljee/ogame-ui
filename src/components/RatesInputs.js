import React from 'react';
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

	renderInput(resource, index) {
		const current = RESOURCES[resource.id];
		return (
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<NumberIntput
					text={current}
					onChange={e => this.props.handleRateChange(e, current)}
					placeholder={current}
					value={this.props.getRate(current)}
				/>
			</div>
		);
	}

	render() {
		return this.resources.map((resource, index) =>
			this.renderInput(resource, index),
		);
	}
}

export default RateInputs;
