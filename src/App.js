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
	console.log(process.env.PUBLIC_URL);
	return (
		<Layout background={background} setBackground={() => setBackground(background === BACKGROUND.light ? BACKGROUND.dark : BACKGROUND.light)}>
			<Router>
				<Switch>
					<Route path={process.env.PUBLIC_URL + '/trades'}>
						<Trader />
					</Route>
					<Route path={process.env.PUBLIC_URL + '/players'}>
						<Players />
					</Route>
					<Route path={process.env.PUBLIC_URL + '/market'}>
						{/* <Home /> */}
					</Route>
					<Route path={process.env.PUBLIC_URL + '/mining'}>
						{/* <Home /> */}
					</Route>
					<Route path={process.env.PUBLIC_URL + '/universes'}>
						{/* <Home /> */}
					</Route>
					<Route path={process.env.PUBLIC_URL + '/score'}>
						{/* <Home /> */}
					</Route>
					<Route path={process.env.PUBLIC_URL + '/alliances'}>
						{/* <Home /> */}
					</Route>
					<Router path={process.env.PUBLIC_URL + '/'}>
						<Home />
					</Router>
				</Switch>
			</Router>
		</Layout >
	)
}

export default App;
