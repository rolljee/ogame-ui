<<<<<<< HEAD
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
						<Route path="/trades">
							<Trader />
						</Route>
						<Route path="/players">
							<Players />
						</Route>
						<Route path="/market">
							{/* <Home /> */}
						</Route>
						<Route path="/mining">
							{/* <Home /> */}
						</Route>
						<Route path="/universes">
							{/* <Home /> */}
						</Route>
						<Route path="/score">
							{/* <Home /> */}
						</Route>
						<Route path="/alliances">
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
=======
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {
	HashRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import Home from './components/Home';
import Trader from './Trader/Trader';
import Players from './Players/Players';

function App() {
	return (
		<>
			<Router basename={process.env.PUBLIC_URL}>
				<Navbar bg="dark" variant="dark">
					<Nav className="mr-auto">
						<Link className="ml-3" to="/">Home</Link>
						<Link className="ml-3" to="trades">Trades</Link>
						<Link className="ml-3" to="players">Players</Link>
						<Link className="ml-3" to="market">Market</Link>
						<Link className="ml-3" to="mining">Mining</Link>
						<Link className="ml-3" to="universes">Universes</Link>
						<Link className="ml-3" to="score">Scores</Link>
						<Link className="ml-3" to="alliances">Alliances</Link>
					</Nav>
				</Navbar>

				<Container fluid className="full-height">
					<Container>
						<Row>
							<Col>
								<Switch>
									<Route path="/trades">
										<Trader />
									</Route>
									<Route path="/players">
										<Players />
									</Route>
									<Route path="/market">
										<Home />
									</Route>
									<Route path="/mining">
										<Home />
									</Route>
									<Route path="/universes">
										<Home />
									</Route>
									<Route path="/score">
										<Home />
									</Route>
									<Route path="/alliances">
										<Home />
									</Route>
									<Router path="/">
										<Home />
									</Router>
								</Switch>
							</Col>
						</Row>
					</Container>
				</Container>
			</Router>
		</>
	);
>>>>>>> 71da4414635601f8a9a400209d506854b5d3e252
}

export default App;
