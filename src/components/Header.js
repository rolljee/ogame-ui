import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Header() {
	return (
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand href="/">OgameJS</Navbar.Brand>
			<Nav className="mr-auto">
				<Nav.Link href="/trades">Trades</Nav.Link>
				<Nav.Link href="/players">Players</Nav.Link>
				<Nav.Link href="/market">Market</Nav.Link>
				<Nav.Link href="/mining">Mining</Nav.Link>
				<Nav.Link href="/universes">Universes</Nav.Link>
				<Nav.Link href="/score">Scores</Nav.Link>
				<Nav.Link href="/alliances">Alliances</Nav.Link>
			</Nav>
		</Navbar>
	)
}
