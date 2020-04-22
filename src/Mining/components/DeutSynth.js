import React from 'react';
import Ogame from 'ogamejs';

function DeutSynth(props) {
	const { planet, universeData } = props;
	const mine = Ogame.models.Buildings[3].base;
	const deut = Ogame.Building.getDeutSynth(mine, Number(planet.deut), planet.temperature, Number(universeData.speed));

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			Niveau: {planet.deut} <br />
			production: {prettify(deut.production)} <br />
			énergie: {prettify(deut.energy)}
		</div>
	);
}

export default DeutSynth;
