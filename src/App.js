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
}

export default App;
