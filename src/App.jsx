import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {
	HashRouter as Router,
	Routes,
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
			<Router>
				<Navbar bg="dark" variant="dark">
					<Nav className="me-auto">
						<Link className="ms-3 text-white" to="/">Home</Link>
						<Link className="ms-3 text-white" to="/trades">Trades</Link>
						<Link className="ms-3 text-white" to="/players">Players</Link>
						<Link className="ms-3 text-white" to="/market">Market</Link>
						<Link className="ms-3 text-white" to="/mining">Mining</Link>
					</Nav>
				</Navbar>

				<Container fluid className="full-height">
					<Container>
						<Row>
							<Col>
								<Routes>
									<Route path="/trades" element={<Trader />} />
									<Route path="/players" element={<Players />} />
									<Route path="/market" element={<Home />} />
									<Route path="/mining" element={<Mining />} />
									<Route path="/" element={<Home />} />
								</Routes>
							</Col>
						</Row>
					</Container>
				</Container>
			</Router>
		</>
	);
}

export default App;
