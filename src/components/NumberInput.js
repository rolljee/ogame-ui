import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

class NumberInput extends React.Component {
	render() {
		return (
			<InputGroup>
				<InputGroup.Prepend>
					<InputGroup.Text id={`input-${this.props.text}`}>{this.props.text}</InputGroup.Text>
				</InputGroup.Prepend>
				<FormControl
					aria-label={this.props.input}
					aria-describedby={`input-${this.props.text}`}
					disabled={this.props.disabled ? 'disabled' : ''}
					max={this.props.maxValue}
					min="0"
					onChange={this.props.onChange}
					placeholder={this.props.placeholder}
					type="number"
					value={this.props.value}
				/>
			</InputGroup>
		);
	}
}

export default NumberInput;
