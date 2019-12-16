import React from 'react';
import RadioButton from './RadioButton';

class Trades extends React.Component {
	render() {
		return (
			<React.Fragment>
				<h4>Resources to trade</h4>
				<RadioButton
					id="metal"
					text="metal"
					value="selected"
					checked={this.props.isCurrentRessource('metal')}
					onChange={e => this.props.handleOnChange(e, 'metal')}
				/>
				<RadioButton
					id="crystal"
					text="crystal"
					value="selected"
					checked={this.props.isCurrentRessource('crystal')}
					onChange={e => this.props.handleOnChange(e, 'crystal')}
				/>
				<RadioButton
					id="deut"
					text="deut"
					value="selected"
					checked={this.props.isCurrentRessource('deut')}
					onChange={e => this.props.handleOnChange(e, 'deut')}
				/>
			</React.Fragment>
		);
	}
}

export default Trades;
