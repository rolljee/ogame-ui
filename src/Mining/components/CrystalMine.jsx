import React from 'react';
import OgameLib from 'ogamejs';

// ogamejs 2.1.x is published as a CommonJS module with a nested default export.
const Ogame = OgameLib.default || OgameLib;

function CrystalMine(props) {
	const { planet, universeData } = props;
	const mine = Ogame.models.Buildings[2].base;
	const crystal = Ogame.Building.getCrystalMine(mine, Number(planet.crystal), 15, Number(universeData.speed));

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			Niveau: {planet.crystal} <br />
			production: {prettify(crystal.production)}<br />
			énergie: {prettify(crystal.energy)}
		</div>
	);
}

export default CrystalMine;
