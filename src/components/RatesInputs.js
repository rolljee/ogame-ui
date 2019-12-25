import React from 'react';
import NumberIntput from './NumberInput';
import { RESOURCES } from './constants';

class RateInputs extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{
				name: RESOURCES.metal,
				value: this.props.getRate(RESOURCES.metal),
				onChange: e => this.props.handleRateChange(e, RESOURCES.metal),
				placeholder: RESOURCES.metal,
			},
			{
				name: RESOURCES.crystal,
				value: this.props.getRate(RESOURCES.crystal),
				onChange: e => this.props.handleRateChange(e, RESOURCES.crystal),
				placeholder: RESOURCES.crystal,
			},
			{
				name: RESOURCES.deut,
				value: this.props.getRate(RESOURCES.deut),
				onChange: e => this.props.handleRateChange(e, RESOURCES.deut),
				placeholder: RESOURCES.deut,
			},
		];
	}

	renderInput(resource, index) {
		return (
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<p className={this.props.getTextColor()}>{resource.name}</p>
				<NumberIntput {...resource} />
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
