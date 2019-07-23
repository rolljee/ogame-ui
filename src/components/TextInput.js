import React from 'react';

class TextInput extends React.Component {
	render() {
		return (
			<div className="form-groups">
				<input
					type="text"
					value={this.props.value}
					onChange={this.props.onChange}
					className="form-control input-xs"
					placeholder={this.props.placeholder}
					disabled={this.props.disabled ? 'disabled' : ''}
				/>
			</div>
		);
	}
}

export default TextInput;
