import React, { Component } from 'react';

/** Components imports */
import { BACKGROUND } from './components/constants';
import Layout from './components/Layout';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			background: BACKGROUND.dark,
		};
	}

	setBackground() {
		this.setState({
			background:
				this.state.background === BACKGROUND.light
					? BACKGROUND.dark
					: BACKGROUND.light,
		});
	}

	render() {
		const { background } = this.state;
		return (
			<Layout background={background} setBackground={this.setBackground} />
		);
	}
}

export default App;
