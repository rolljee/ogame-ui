import React from 'react';
import Ogame from 'ogamejs';

function MetalMine(props) {
	const { planet } = props;
	const mine = Ogame.models.Buildings[1].base;
	const metal = Ogame.Building.getMetalMine(mine, Number(planet.metal), 5);

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			<p>Niveau: {planet.metal}</p>
			<p>production: {prettify(metal.production)}</p>
			<p>énergie: {prettify(metal.energy)}</p>
		</div>
	);
}

export default MetalMine;
