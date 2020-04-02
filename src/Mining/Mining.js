import React from 'react';
import Table from 'react-bootstrap/Table';

import Ogame from 'ogamejs';
import { MINES } from '../components/constants';

function Mining() {
	console.log(Ogame);
	return (
		<Table responsive striped bordered hover variant="dark">
			<thead>
				<tr>
					<th>Planet list</th>
					{MINES.map((mine, index) => (
						<th key={index}>
							<img src={mine.img} alt={mine.name} width="60" height="60" />
						</th>
					))}
					<th>Energy tech</th>
					<th>Energy total</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th>pla 1</th>
					<th>2</th>
					<th>3</th>
					<th>4</th>
					<th>5</th>
					<th>6</th>
					<th>7</th>
					<th>8</th>
				</tr>
			</tbody>
		</Table>
	);
}


export default Mining;
