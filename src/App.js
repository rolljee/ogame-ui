import Ogame from 'ogamejs';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

/** Components import */
import PrintResult from './components/PrintResult';
import RateText from './components/RateText';
import Title from './components/Title';
import Trades from './components/Trades';
import DefaultRates from './components/DefaultRates';
import { BACKGROUND, RATES } from './components/constant';
import RateInputs from './components/RatesInputs';
import Percents from './components/Percents';

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
			rate: RATES.standard,
			background: BACKGROUND.dark,
		};

		this.getActiveRate = this.getActiveRate.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.isCurrentRessource = this.isCurrentRessource.bind(this);
		this.handlePercentChange = this.handlePercentChange.bind(this);
		this.isNotCurrentResource = this.isNotCurrentResource.bind(this);
		this.handleResourceChange = this.handleResourceChange.bind(this);
		this.setRate = this.setRate.bind(this);
		this.getRate = this.getRate.bind(this);
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

	roundToHundred(percent, modifiedResource) {
		const currentResource = this.state.selected;
		if (currentResource === 'deut' && modifiedResource === 'metal') {
			return {
				percentCrystal: 100 - percent,
			};
		} else if (currentResource === 'deut' && modifiedResource === 'crystal') {
			return {
				percentMetal: 100 - percent,
			};
		} else if (currentResource === 'metal' && modifiedResource === 'deut') {
			return {
				percentCrystal: 100 - percent,
			};
		} else if (currentResource === 'metal' && modifiedResource === 'crystal') {
			return {
				percentDeut: 100 - percent,
			};
		} else if (currentResource === 'crystal' && modifiedResource === 'metal') {
			return {
				percentDeut: 100 - percent,
			};
		} else if (currentResource === 'crystal' && modifiedResource === 'deut') {
			return {
				percentMetal: 100 - percent,
			};
		}
	}

	handlePercentChange(e, resource) {
		const percent = this.roundValue(Number(e.target.value));

		if (resource === 'deut') {
			this.setState(
				{ percentDeut: percent, ...this.roundToHundred(percent, 'deut') },
				this.printResult,
			);
		} else if (resource === 'metal') {
			this.setState(
				{ percentMetal: percent, ...this.roundToHundred(percent, 'metal') },
				this.printResult,
			);
		} else if (resource === 'crystal') {
			this.setState(
				{ percentCrystal: percent, ...this.roundToHundred(percent, 'crystal') },
				this.printResult,
			);
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

	getActiveRate(selectedRate) {
		const { rate } = this.state;
		const isActive = selectedRate === rate;

		return isActive ? 'info' : 'default';
	}

	setRate(selectedRate) {
		this.setState({ rate: selectedRate });
	}

	getPercent(resource) {
		const { percentCrystal, percentDeut, percentMetal } = this.state;
		let deut = this.roundValue(percentDeut);
		let metal = this.roundValue(percentMetal);
		let crystal = this.roundValue(percentCrystal);

		if (resource === 'deut') {
			return {
				percentCrystal: crystal,
				percentDeut: 0,
				percentMetal: metal,
			};
		} else if (resource === 'metal') {
			return {
				percentCrystal: crystal,
				percentDeut: deut,
				percentMetal: 0,
			};
		} else if (resource === 'crystal') {
			return {
				percentCrystal: 0,
				percentDeut: deut,
				percentMetal: metal,
			};
		}
	}

	isCurrentRessource(value) {
		return value === this.state.selected;
	}

	isNotCurrentResource(resource) {
		return this.state.selected !== resource;
	}

	roundValue(percent) {
		if (percent > 100) {
			return 100;
		}

		return percent;
	}

	setBackground() {
		this.setState({
			background:
				this.state.background === BACKGROUND.light
					? BACKGROUND.dark
					: BACKGROUND.light,
		});
	}

	render() {
		const { metal, crystal, deut, selected, rate, background } = this.state;
		const { percentMetal, percentCrystal, percentDeut } = this.getPercent(
			selected,
		);
		return (
			<div className={`background-${background}`}>
				<div className="text-right">
					<FontAwesomeIcon icon={faMoon} onClick={() => this.setBackground()} />
				</div>
				<div className="container container-fluid">
					<div className="col-xs-12">
						<div className="text-center">
							<Title />
						</div>

						<div className="col-xs-6">
							<Trades
								isCurrentRessource={this.isCurrentRessource}
								handleOnChange={this.handleOnChange}
							/>
						</div>

						{/* CHANGE RATES */}
						<div className="col-xs-6">
							<div className="col-xs-12">
								<DefaultRates
									getActiveRate={this.getActiveRate}
									setRate={this.setRate}
								/>
							</div>
							<div className="col-xs-12">
								<hr />
								<RateInputs
									getRate={this.getRate}
									handleRateChange={this.handleRateChange}
								/>
							</div>

							{/* CHANGE PERCENT */}
							<div className="col-xs-12">
								<hr />
								<Percents
									handlePercentChange={this.handlePercentChange}
									isCurrentRessource={this.isCurrentRessource}
									percentMetal={percentMetal}
									percentCrystal={percentCrystal}
									percentDeut={percentDeut}
								/>
							</div>
						</div>

						{/* CHANGE RESOURCES TO TRADE */}
						<div className="col-xs-12">
							<h4>Resources</h4>
							<p className="text-center">
								<RateText rate={rate} selected={selected} />
							</p>
						</div>

						{/* PRINT THE RESULT */}
						<div className="col-xs-12">
							<div className="text-center">
								<hr />
								<PrintResult
									deut={deut}
									metal={metal}
									crystal={crystal}
									selected={selected}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
