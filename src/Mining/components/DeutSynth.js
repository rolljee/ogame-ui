import React from 'react';
import Ogame from 'ogamejs';

function DeutSynth(props) {
	const { planet } = props;
	const mine = Ogame.models.Buildings[3].base;
	const deut = Ogame.Building.getDeutSynth(mine, Number(planet.deut), planet.temperature, 5);

	function prettify(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	}

	return (
		<div>
			<p>Niveau: {planet.deut}</p>
			<p>production: {prettify(deut.production)}</p>
			<p>énergie: {prettify(deut.energy)}</p>
		</div>
	);
}

export default DeutSynth;
