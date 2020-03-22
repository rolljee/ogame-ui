import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import NumberIntput from './NumberInput';
import { RESOURCES } from './constants';

class Percents extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{
				name: '%metal',
				maxValue: 100,
				resource: RESOURCES.metal,
				percent: 'percentMetal',
			},
			{
				name: '%crystal',
				maxValue: 100,
				resource: RESOURCES.crystal,
				percent: 'percentCrystal',
			},
			{
				name: '%deut',
				maxValue: 100,
				resource: RESOURCES.deut,
				percent: 'percentDeut',
			},
		];
	}
	renderInputs({ resource, name, maxValue, percent }, index) {
		return (
			<Col key={index}>
				<NumberIntput
					text={name}
					disabled={this.props.isCurrentRessource(resource)}
					maxValue={maxValue}
					onChange={e => this.props.handlePercentChange(e, resource)}
					placeholder={resource}
					value={this.props[percent]}
				/>
			</Col>
		);
	}
	render() {
		return (
			<Row>
				{this.resources.map((resource, index) => this.renderInputs(resource, index))}
			</Row>
		);
	}
}

export default Percents;
