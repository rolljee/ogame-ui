import React from 'react';
import RadioButton from './RadioButton';
import { RESOURCES } from './constants';

class Trades extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{
				id: RESOURCES.metal,
				text: RESOURCES.metal,
				name: RESOURCES.metal,
				value: 'selected',
				checked: this.props.isCurrentRessource(RESOURCES.metal),
				onChange: e => this.props.handleOnChange(e, RESOURCES.metal),
			},
			{
				id: RESOURCES.crystal,
				text: RESOURCES.crystal,
				name: RESOURCES.crystal,
				value: 'selected',
				checked: this.props.isCurrentRessource(RESOURCES.crystal),
				onChange: e => this.props.handleOnChange(e, RESOURCES.crystal),
			},
			{
				id: RESOURCES.deut,
				text: RESOURCES.deut,
				name: RESOURCES.deut,
				value: 'selected',
				checked: this.props.isCurrentRessource(RESOURCES.deut),
				onChange: e => this.props.handleOnChange(e, RESOURCES.deut),
			},
		];
	}
	renderRadio(resource, index) {
		return (
			<div className="col-md-12 col-sm-12 col-xs-12" key={index}>
				<RadioButton {...resource} />
			</div>
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
