import React from 'react';
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
	renderRadio({ resource, name, maxValue, percent }, index) {
		return (
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<NumberIntput
					text={name}
					disabled={this.props.isCurrentRessource(resource)}
					maxValue={maxValue}
					onChange={e => this.props.handlePercentChange(e, resource)}
					placeholder={resource}
					value={this.props[percent]}
				/>
			</div>
		);
	}
	render() {
		return this.resources.map((resource, index) =>
			this.renderRadio(resource, index),
		);
	}
}

export default Percents;
