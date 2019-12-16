import React from 'react';
import NumberIntput from './NumberInput';

class RateInputs extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="col-xs-4">
					metal
					<NumberIntput
						value={this.props.getRate('metal')}
						onChange={e => this.props.handleRateChange(e, 'metal')}
						placeholder="metal"
					/>
				</div>
				<div className="col-xs-4">
					crystal
					<NumberIntput
						value={this.props.getRate('crystal')}
						onChange={e => this.props.handleRateChange(e, 'crystal')}
						placeholder="crystal"
					/>
				</div>
				<div className="col-xs-4">
					deuterium
					<NumberIntput
						value={this.props.getRate('deut')}
						onChange={e => this.props.handleRateChange(e, 'deut')}
						placeholder="deut"
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default RateInputs;
