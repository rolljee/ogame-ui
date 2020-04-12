import React from 'react';
import Ogame from 'ogamejs';

function CrystalMine(props) {
	const { planet } = props;
	const mine = Ogame.models.Buildings[2].base;
	const crystal = Ogame.Building.getCrystalMine(mine, Number(planet.crystal), 15, 5);

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			<p>Niveau: {planet.crystal}</p>
			<p>production: {prettify(crystal.production)}</p>
			<p>énergie: {prettify(crystal.energy)}</p>
		</div>
	);
}

export default CrystalMine;
