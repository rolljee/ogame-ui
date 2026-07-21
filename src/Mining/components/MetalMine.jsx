import React from 'react';
import OgameLib from 'ogamejs';

// ogamejs 2.1.x is published as a CommonJS module with a nested default export.
const Ogame = OgameLib.default || OgameLib;

function MetalMine(props) {
	const { planet, universeData } = props;
	const mine = Ogame.models.Buildings[1].base;
	const metal = Ogame.Building.getMetalMine(mine, Number(planet.metal), Number(universeData.speed));

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			Niveau: {planet.metal} <br />
			production: {prettify(metal.production)} <br />
			énergie: {prettify(metal.energy)}
		</div>
	);
}

export default MetalMine;
