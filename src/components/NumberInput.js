import React from 'react';

class NumberInput extends React.Component {
	render() {
		return (
			<div className="input-group">
				<span className="input-group-addon">{this.props.text}</span>
				<input
					className="form-control input-xs"
					disabled={this.props.disabled ? 'disabled' : ''}
					max={this.props.maxValue}
					min="0"
					onChange={this.props.onChange}
					placeholder={this.props.placeholder}
					type="number"
					value={this.props.value}
				/>
			</div>
		);
	}
}

export default NumberInput;
