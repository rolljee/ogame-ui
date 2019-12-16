import React from 'react';
import { RATES } from './constant';

class DefaultRates extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="col-xs-4">
					<button
						onClick={() => this.props.setRate(RATES.max)}
						className={`btn label label-${this.props.getActiveRate(
							RATES.max,
						)} clickable`}>
						{RATES.max}
					</button>
				</div>
				<div className="col-xs-4">
					<button
						onClick={() => this.props.setRate(RATES.standard)}
						className={`btn label label-${this.props.getActiveRate(
							RATES.standard,
						)} clickable`}>
						{RATES.standard}
					</button>
				</div>
				<div className="col-xs-4">
					<button
						onClick={() => this.props.setRate(RATES.ally)}
						className={`btn label label-${this.props.getActiveRate(
							RATES.ally,
						)} clickable`}>
						{RATES.ally}
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default DefaultRates;
