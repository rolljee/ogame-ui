import React from 'react';
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
	renderLabel(resource, index) {
		const current = RESOURCES[resource.id];
		const color = this.props.getActiveTrade(current);
		return (
			<span className="margin-right-sm" key={index}>
				<button
					onClick={() => this.props.handleOnChange(current)}
					className={`btn btn-lg label label-${color} clickable`}>
					{current}
				</button>
			</span>
		);
	}
	render() {
		return this.resources.map((resource, index) =>
			this.renderLabel(resource, index),
		);
	}
}

export default Trades;
