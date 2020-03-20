import React from 'react';
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
			<button onClick={this.handleOnClick} className="btn btn-default">
				Copy
			</button>
		);
	}
}

export default CopyButton;
