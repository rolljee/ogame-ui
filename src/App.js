import Ogame from 'ogamejs';
import React, { Component } from 'react';

/** Components import */
import Title from './components/Title';
import RateText from './components/RateText';
import RadioButton from './components/RadioButton';
import TextInput from './components/TextInput';
import PrintResult from './components/PrintResult';

class App extends Component {
	constructor() {
		super();
		this.state = {
			deut: 0,
			metal: 0,
			crystal: 0,
			percentDeut: 0,
			percentMetal: 60,
			percentCrystal: 40,
			selected: 'deut',
			rate: '2:1.5:1',
		};
	}

	sellDeut() {
		const { deut, percentMetal, percentCrystal, rate } = this.state;
		const { metal, crystal } = Ogame.sellDeut(
			deut,
			percentMetal,
			percentCrystal,
			rate,
		);
		this.setState({ metal, crystal });
	}

	sellMetal() {
		const { metal, percentDeut, percentCrystal, rate } = this.state;
		const { crystal, deut } = Ogame.sellMetal(
			metal,
			percentDeut,
			percentCrystal,
			rate,
		);
		this.setState({ deut, crystal });
	}

	sellCrystal() {
		const { crystal, percentDeut, percentMetal, rate } = this.state;
		const { metal, deut } = Ogame.sellCrystal(
			crystal,
			percentDeut,
			percentMetal,
			rate,
		);
		this.setState({ metal, deut });
	}

	printResult() {
		if (this.state.selected === 'deut') {
			this.sellDeut();
		} else if (this.state.selected === 'metal') {
			this.sellMetal();
		} else if (this.state.selected === 'crystal') {
			this.sellCrystal();
		}
	}

	handleOnChange(e, selected) {
		if (e.target.checked) {
			this.setState({ selected });
		}
	}

	handleResourceChange(e, resource) {
		const value = Number(e.target.value);
		if (resource === 'deut') {
			this.setState({ deut: value }, this.printResult);
		} else if (resource === 'metal') {
			this.setState({ metal: value }, this.printResult);
		} else if (resource === 'crystal') {
			this.setState({ crystal: value }, this.printResult);
		}
	}

	handleRateChange(e, resource) {
		const value = e.target.value;
		const split = this.state.rate.split(':');
		let deut = split[2];
		let metal = split[0];
		let crystal = split[1];
		let rate = `${metal}:${crystal}:${deut}`;

		if (resource === 'deut') {
			rate = `${metal}:${crystal}:${value}`;
		} else if (resource === 'metal') {
			rate = `${value}:${crystal}:${deut}`;
		} else if (resource === 'crystal') {
			rate = `${metal}:${value}:${deut}`;
		}
		this.setState({ rate }, this.printResult);
	}

	handlePercentChange(e, resource) {
		const value = Number(e.target.value);
		if (resource === 'deut') {
			this.setState({ percentDeut: value }, this.printResult);
		} else if (resource === 'metal') {
			this.setState({ percentMetal: value }, this.printResult);
		} else if (resource === 'crystal') {
			this.setState({ percentCrystal: value }, this.printResult);
		}
	}

	getRate(resource) {
		const split = this.state.rate.split(':');
		let deut = split[2];
		let metal = split[0];
		let crystal = split[1];
		if (resource === 'deut') {
			return deut;
		} else if (resource === 'metal') {
			return metal;
		} else if (resource === 'crystal') {
			return crystal;
		}
	}

	getPercent(resource) {
		const { percentCrystal, percentDeut, percentMetal } = this.state;
		if (resource === 'deut') {
			return {
				percentMetal,
				percentCrystal,
				percentDeut: 0,
			};
		} else if (resource === 'metal') {
			return {
				percentMetal: 0,
				percentCrystal,
				percentDeut,
			};
		} else if (resource === 'crystal') {
			return {
				percentMetal,
				percentCrystal: 0,
				percentDeut,
			};
		}
	}

	isSelected(value) {
		return value === this.state.selected;
	}

	disabledIfNotSelected(resource) {
		return this.state.selected !== resource;
	}

	render() {
		const { metal, crystal, deut, selected, rate } = this.state;
		const { percentMetal, percentCrystal, percentDeut } = this.getPercent(
			selected,
		);
		return (
			<div className="container container-fluid">
				<div className="col-xs-12">
					<div className="text-center">
						<Title />
						<hr />
					</div>

					{/* SELECT RESSOURCE TO TRADE */}
					<div className="col-xs-6">
						<h4>Resources to trade</h4>
						<RadioButton
							id="metal"
							text="metal"
							value="selected"
							checked={this.isSelected('metal')}
							onChange={e => this.handleOnChange(e, 'metal')}
						/>
						<RadioButton
							id="crystal"
							text="crystal"
							value="selected"
							checked={this.isSelected('crystal')}
							onChange={e => this.handleOnChange(e, 'crystal')}
						/>
						<RadioButton
							id="deut"
							text="deut"
							value="selected"
							checked={this.isSelected('deut')}
							onChange={e => this.handleOnChange(e, 'deut')}
						/>
					</div>

					{/* CHANGE RATES */}
					<div className="col-xs-6">
						<div className="col-xs-4">
							metal
							<TextInput
								value={this.getRate('metal')}
								onChange={e => this.handleRateChange(e, 'metal')}
								placeholder="metal"
							/>
						</div>
						<div className="col-xs-4">
							crystal
							<TextInput
								value={this.getRate('crystal')}
								onChange={e => this.handleRateChange(e, 'crystal')}
								placeholder="crystal"
							/>
						</div>
						<div className="col-xs-4">
							deuterium
							<TextInput
								value={this.getRate('deut')}
								onChange={e => this.handleRateChange(e, 'deut')}
								placeholder="deut"
							/>
						</div>

						{/* CHANGE PERCENT */}
						<div className="col-xs-12">
							<hr />
							<div className="col-xs-4">
								%metal
								<TextInput
									value={percentMetal}
									onChange={e => this.handlePercentChange(e, 'metal')}
									placeholder="metal"
								/>
							</div>
							<div className="col-xs-4">
								%crystal
								<TextInput
									value={percentCrystal}
									onChange={e => this.handlePercentChange(e, 'crystal')}
									placeholder="crystal"
								/>
							</div>
							<div className="col-xs-4">
								%deut
								<TextInput
									value={percentDeut}
									onChange={e => this.handlePercentChange(e, 'deut')}
									placeholder="deut"
								/>
							</div>
						</div>
					</div>

					{/* CHANGE RESOURCES TO TRADE */}
					<div className="col-xs-12">
						<hr />
						<h4>Resources</h4>
						<p className="text-center">
							<RateText rate={rate} selected={selected} />
						</p>

						<div className="col-xs-4">
							metal
							<TextInput
								value={metal}
								onChange={e => this.handleResourceChange(e, 'metal')}
								placeholder="metal"
								disabled={this.disabledIfNotSelected('metal')}
							/>
						</div>
						<div className="col-xs-4">
							crystal
							<TextInput
								value={crystal}
								onChange={e => this.handleResourceChange(e, 'crystal')}
								placeholder="crystal"
								disabled={this.disabledIfNotSelected('crystal')}
							/>
						</div>
						<div className="col-xs-4">
							deut
							<TextInput
								value={deut}
								onChange={e => this.handleResourceChange(e, 'deut')}
								placeholder="deut"
								disabled={this.disabledIfNotSelected('deut')}
							/>
						</div>
					</div>

					{/* PRINT THE RESULT */}
					<div className="col-xs-12">
						<div className="text-center">
							<hr />
							<p>
								<PrintResult
									deut={deut}
									metal={metal}
									crystal={crystal}
									selected={selected}
								/>
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
