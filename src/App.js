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
import Mining from './Mining/Mining';

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
					</Nav>
				</Navbar>

				<Container fluid className="full-height">
					<Row>
						<Col>
							<Switch>
								<Route path="/trades">
									<Container>
										<Trader />
									</Container>
								</Route>
								<Route path="/players">
									<Container>
										<Players />
									</Container>
								</Route>
								<Route path="/market">
									<Home />
								</Route>
								<Route path="/mining">
									<Mining />
								</Route>
								<Router path="/">
									<Container>
										<Home />
									</Container>
								</Router>
							</Switch>
						</Col>
					</Row>
				</Container>
			</Router>
		</>
	);
}

export default App;
