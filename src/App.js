import React, { useState } from 'react';
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

function App() {
	const [background, setBackground] = useState(BACKGROUND.dark);

	return (
		<Layout background={background} setBackground={() => setBackground(background === BACKGROUND.light ? BACKGROUND.dark : BACKGROUND.light)}>
			<Router basename="ogame-ui">
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
	)
}

export default App;
