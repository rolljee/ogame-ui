import React from 'react';
import Button from 'react-bootstrap/Button';
import copy from 'copy-to-clipboard';


class CopyButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick() {
		copy(this.props.text);
	}

	render() {
		return (
			<Button variant="light" onClick={this.handleOnClick}>Copy</Button>
		);
	}
}

export default CopyButton;
