import React from 'react';
import Container from 'react-bootstrap/Container';
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
import Universe from './Universe/Universe';

function App() {
	return (
		<>
			<Router basename={process.env.PUBLIC_URL}>
				<Navbar bg="dark" variant="dark">
					<Nav className="mr-auto">
						<Link className="ml-3 text-white" to="/">Home</Link>
						<Link className="ml-3 text-white" to="trades">Trades</Link>
						<Link className="ml-3 text-white" to="players">Players</Link>
						<Link className="ml-3 text-white" to="market">Market</Link>
						<Link className="ml-3 text-white" to="mining">Mining</Link>
						<Link className="ml-3 text-white" to="universes">Universes</Link>
						<Link className="ml-3 text-white" to="score">Scores</Link>
						<Link className="ml-3 text-white" to="alliances">Alliances</Link>
					</Nav>
				</Navbar>

				<Container>
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
							<Universe />
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
				</Container>
			</Router>
		</>
	);
}

export default App;
