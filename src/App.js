import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";

import { BACKGROUND } from './components/constants';
import Layout from './components/Layout';
import Home from './Home';
import Trader from './Trader/Trader';
import Players from './Players/Players';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			background: BACKGROUND.dark,
		};

		this.setBackground = this.setBackground.bind(this);
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
			<Layout background={background} setBackground={this.setBackground}>
				<Router>
					<Switch>
						<Route path="trades">
							<Trader />
						</Route>
						<Route path="players">
							<Players />
						</Route>
						<Route path="market">
							{/* <Home /> */}
						</Route>
						<Route path="mining">
							{/* <Home /> */}
						</Route>
						<Route path="universes">
							{/* <Home /> */}
						</Route>
						<Route path="score">
							{/* <Home /> */}
						</Route>
						<Route path="alliances">
							{/* <Home /> */}
						</Route>
						<Router path="/">
							<Home />
						</Router>
					</Switch>
				</Router>
			</Layout >
		);
	}
}

export default App;
