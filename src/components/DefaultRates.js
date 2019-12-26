import React from 'react';
import { RATES } from './constants';

class DefaultRates extends React.Component {
	constructor(props) {
		super(props);
		this.renderRates = this.renderRates.bind(this);
	}
	renderRates({ rate }, index) {
		const color = this.props.getActiveRate(rate);
		return (
			<span className="margin-right-sm" key={index}>
				<button
					onClick={() => this.props.setRate(rate)}
					className={`btn label label-${color} clickable`}>
					{rate}
				</button>
			</span>
		);
	}
	render() {
		return RATES.map((rate, index) => this.renderRates(rate, index));
	}
}

export default DefaultRates;
