import React from 'react';
import Button from 'react-bootstrap/Button';

import { RATES } from '../../components/constants';

class DefaultRates extends React.Component {
	constructor(props) {
		super(props);
		this.renderRates = this.renderRates.bind(this);
	}
	renderRates({ rate }, index) {
		const color = this.props.getActiveRate(rate);
		return (
			<Button
				variant={color}
				onClick={() => this.props.setRate(rate)}
				className={`margin-right-sm`} key={index}>
				{rate}
			</Button>
		);
	}
	render() {
		return RATES.map((rate, index) => this.renderRates(rate, index));
	}
}

export default DefaultRates;
