import React from 'react';
import NumberIntput from './NumberInput';

class Percents extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="col-xs-4">
					%metal
					<NumberIntput
						value={this.props.percentMetal}
						onChange={e => this.props.handlePercentChange(e, 'metal')}
						placeholder="metal"
						disabled={this.props.isCurrentRessource('metal')}
						maxValue="100"
					/>
				</div>
				<div className="col-xs-4">
					%crystal
					<NumberIntput
						value={this.props.percentCrystal}
						onChange={e => this.props.handlePercentChange(e, 'crystal')}
						placeholder="crystal"
						disabled={this.props.isCurrentRessource('crystal')}
						maxValue="100"
					/>
				</div>
				<div className="col-xs-4">
					%deut
					<NumberIntput
						value={this.props.percentDeut}
						onChange={e => this.props.handlePercentChange(e, 'deut')}
						placeholder="deut"
						disabled={this.props.isCurrentRessource('deut')}
						maxValue="100"
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default Percents;
