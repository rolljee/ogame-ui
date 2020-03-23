import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

export default function Header() {
	return (
		<Router>
			<Navbar bg="dark" variant="dark">
				<Navbar.Brand href="/">OgameJS</Navbar.Brand>
				<Nav className="mr-auto">
					<Nav.Link>
						<Link to="/trades">Trades</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/market">Market</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/mining">Mining</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/universes">Universes</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/score">Scores</Link>
					</Nav.Link>
					<Nav.Link>
						<Link to="/alliances">Alliances</Link>
					</Nav.Link>
				</Nav>
				<Form inline>
					<FormControl type="text" placeholder="Search" className="mr-sm-2" />
					<Button variant="outline-info">Search</Button>
				</Form>
			</Navbar>
			<Switch>
				<Route path="/trades">
					{/* <Home /> */}
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
			</Switch>
		</Router>
	)
}
