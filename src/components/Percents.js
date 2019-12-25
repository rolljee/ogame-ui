import React from 'react';
import NumberIntput from './NumberInput';
import { RESOURCES } from './constants';

class Percents extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{ name: '%metal', maxValue: 100, resource: RESOURCES.metal },
			{ name: '%crystal', maxValue: 100, resource: RESOURCES.crystal },
			{ name: '%deut', maxValue: 100, resource: RESOURCES.deut },
		];
	}
	renderRadio({ resource, name, maxValue }, index) {
		return (
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<p className={this.props.getTextColor()}>{name}</p>
				<NumberIntput
					disabled={this.props.isCurrentRessource(resource)}
					maxValue={maxValue}
					onChange={e => this.props.handlePercentChange(e, resource)}
					placeholder={resource}
					value={this.props.percentMetal}
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
