import React from 'react';
import NumberIntput from './NumberInput';

class Resources extends React.Component {
	render() {
		return (
			<React.Fragment>
				<div className="col-xs-4">
					metal
					<NumberIntput
						value={this.props.metal}
						onChange={e => this.props.handleResourceChange(e, 'metal')}
						placeholder="metal"
						disabled={this.props.isNotCurrentResource('metal')}
					/>
				</div>
				<div className="col-xs-4">
					crystal
					<NumberIntput
						value={this.props.crystal}
						onChange={e => this.props.handleResourceChange(e, 'crystal')}
						placeholder="crystal"
						disabled={this.props.isNotCurrentResource('crystal')}
					/>
				</div>
				<div className="col-xs-4">
					deut
					<NumberIntput
						value={this.props.deut}
						onChange={e => this.props.handleResourceChange(e, 'deut')}
						placeholder="deut"
						disabled={this.props.isNotCurrentResource('deut')}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default Resources;
