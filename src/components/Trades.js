import React from 'react';
import RadioButton from './RadioButton';
import { RESOURCES } from './constants';

class Trades extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{ id: RESOURCES.metal },
			{ id: RESOURCES.crystal },
			{ id: RESOURCES.deut },
		];
	}
	renderRadio(resource, index) {
		const current = RESOURCES[resource.id];
		return (
			<RadioButton
				key={index}
				name="selected"
				text={current}
				checked={this.props.isCurrentRessource(current)}
				onChange={e => this.props.handleOnChange(e, current)}
			/>
		);
	}
	render() {
		return (
			<div className={`col-xs-12 ${this.props.getTextColor()}`}>
				{this.resources.map((resource, index) =>
					this.renderRadio(resource, index),
				)}
			</div>
		);
	}
}

export default Trades;
