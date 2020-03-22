import React from 'react';
import Button from 'react-bootstrap/Button';

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
			<Button
				variant={color}
				onClick={() => this.props.handleOnChange(current)}
				className={`margin-right-sm`} key={index}>
				{current}
			</Button>
		);
	}
	render() {
		return this.resources.map((resource, index) =>
			this.renderLabel(resource, index),
		);
	}
}

export default Trades;
