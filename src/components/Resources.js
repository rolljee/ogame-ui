import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import NumberIntput from './NumberInput';
import { RESOURCES } from './constants';

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.resources = [
			{
				displayName: 'Metal',
				name: RESOURCES.metal,
			},
			{
				displayName: 'Crystal',
				name: RESOURCES.crystal,
			},
			{
				displayName: 'Deut',
				name: RESOURCES.deut,
			},
		];
	}
	renderInputs(resource, index) {
		return (
			<Col key={index}>
				<NumberIntput
					disabled={this.props.isNotCurrentResource(resource.name)}
					onChange={e => this.props.handleResourceChange(e, resource.name)}
					placeholder={resource.name}
					text={resource.displayName}
					value={this.props[resource.name]}
				/>
			</Col>
		);
	}
	render() {
		return (
			<Row>
				{this.resources.map((resource, index) => this.renderInputs(resource, index))}
			</Row>
		)
	}
}

export default Resources;
