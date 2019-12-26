import React from 'react';
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
		this.renderResources = this.renderResources.bind(this);
	}
	renderResources(resource, index) {
		return (
			<div className="col-md-4 col-sm-4 col-xs-12" key={index}>
				<NumberIntput
					disabled={this.props.isNotCurrentResource(resource.name)}
					onChange={e => this.props.handleResourceChange(e, resource.name)}
					placeholder={resource.name}
					text={resource.displayName}
					value={this.props[resource.name]}
				/>
			</div>
		);
	}
	render() {
		return this.resources.map((resource, index) =>
			this.renderResources(resource, index),
		);
	}
}

export default Resources;
