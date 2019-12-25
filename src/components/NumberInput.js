import React from 'react';

class TextInput extends React.Component {
	render() {
		return (
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
		);
	}
}

export default TextInput;
