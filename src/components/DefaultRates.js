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
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<button
					onClick={() => this.props.setRate(rate)}
					className={`btn label label-${color} clickable`}>
					{rate}
				</button>
			</div>
		);
	}
	render() {
		return RATES.map((rate, index) => this.renderRates(rate, index));
	}
}

export default DefaultRates;
