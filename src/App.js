import Ogame from 'ogamejs';
import React, { Component } from 'react';

/** Bootstrap imports */
import Col from 'react-bootstrap/Col';

/** Components imports */
import { BACKGROUND, RESOURCES } from './components/constants';
import DefaultRates from './components/DefaultRates';
import Layout from './components/Layout';
import Percents from './components/Percents';
import PrintResult from './components/PrintResult';
import RateInputs from './components/RatesInputs';
import RateText from './components/RateText';
import Resources from './components/Resources';
import Trades from './components/Trades';

class App extends Component {
	constructor() {
		super();
		this.state = {
			background: BACKGROUND.dark,
			crystal: 0,
			deut: 0,
			metal: 0,
			percentCrystal: 40,
			percentDeut: 0,
			percentMetal: 60,
			rate: '2:1.5:1',
			selected: RESOURCES.deut,
		};

		this.getActiveRate = this.getActiveRate.bind(this);
		this.getRate = this.getRate.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.getActiveTrade = this.getActiveTrade.bind(this);
		this.handlePercentChange = this.handlePercentChange.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handleResourceChange = this.handleResourceChange.bind(this);
		this.handleResourceChange = this.handleResourceChange.bind(this);
		this.isCurrentRessource = this.isCurrentRessource.bind(this);
		this.isNotCurrentResource = this.isNotCurrentResource.bind(this);
		this.setBackground = this.setBackground.bind(this);
		this.setRate = this.setRate.bind(this);
	}

	sellDeut() {
		const { deut, percentMetal, percentCrystal, rate } = this.state;
		const { metal, crystal } = Ogame.Trader.sellDeut(
			deut,
			percentMetal,
			percentCrystal,
			rate,
		);
		this.setState({ metal, crystal });
	}

	sellMetal() {
		const { metal, percentDeut, percentCrystal, rate } = this.state;
		const { crystal, deut } = Ogame.Trader.sellMetal(
			metal,
			percentDeut,
			percentCrystal,
			rate,
		);
		this.setState({ deut, crystal });
	}

	sellCrystal() {
		const { crystal, percentDeut, percentMetal, rate } = this.state;
		const { metal, deut } = Ogame.Trader.sellCrystal(
			crystal,
			percentDeut,
			percentMetal,
			rate,
		);
		this.setState({ metal, deut });
	}

	printResult() {
		if (this.state.selected === RESOURCES.deut) {
			this.sellDeut();
		} else if (this.state.selected === RESOURCES.metal) {
			this.sellMetal();
		} else if (this.state.selected === RESOURCES.crystal) {
			this.sellCrystal();
		}
	}

	handleOnChange(selected) {
		this.setState({ selected });
	}

	handleResourceChange(e, resource) {
		const value = Number(e.target.value);
		if (resource === RESOURCES.deut) {
			this.setState({ deut: value }, this.printResult);
		} else if (resource === RESOURCES.metal) {
			this.setState({ metal: value }, this.printResult);
		} else if (resource === RESOURCES.crystal) {
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

		if (resource === RESOURCES.deut) {
			rate = `${metal}:${crystal}:${value}`;
		} else if (resource === RESOURCES.metal) {
			rate = `${value}:${crystal}:${deut}`;
		} else if (resource === RESOURCES.crystal) {
			rate = `${metal}:${value}:${deut}`;
		}
		this.setState({ rate }, this.printResult);
	}

	roundToHundred(percent, modifiedResource) {
		const currentResource = this.state.selected;
		if (
			currentResource === RESOURCES.deut &&
			modifiedResource === RESOURCES.metal
		) {
			return {
				percentCrystal: 100 - percent,
			};
		} else if (
			currentResource === RESOURCES.deut &&
			modifiedResource === RESOURCES.crystal
		) {
			return {
				percentMetal: 100 - percent,
			};
		} else if (
			currentResource === RESOURCES.metal &&
			modifiedResource === RESOURCES.deut
		) {
			return {
				percentCrystal: 100 - percent,
			};
		} else if (
			currentResource === RESOURCES.metal &&
			modifiedResource === RESOURCES.crystal
		) {
			return {
				percentDeut: 100 - percent,
			};
		} else if (
			currentResource === RESOURCES.crystal &&
			modifiedResource === RESOURCES.metal
		) {
			return {
				percentDeut: 100 - percent,
			};
		} else if (
			currentResource === RESOURCES.crystal &&
			modifiedResource === RESOURCES.deut
		) {
			return {
				percentMetal: 100 - percent,
			};
		}
	}

	handlePercentChange(e, resource) {
		const percent = this.roundValue(Number(e.target.value));

		if (resource === RESOURCES.deut) {
			this.setState(
				{
					percentDeut: percent,
					...this.roundToHundred(percent, RESOURCES.deut),
				},
				this.printResult,
			);
		} else if (resource === RESOURCES.metal) {
			this.setState(
				{
					percentMetal: percent,
					...this.roundToHundred(percent, RESOURCES.metal),
				},
				this.printResult,
			);
		} else if (resource === RESOURCES.crystal) {
			this.setState(
				{
					percentCrystal: percent,
					...this.roundToHundred(percent, RESOURCES.crystal),
				},
				this.printResult,
			);
		}
	}

	getRate(resource) {
		const split = this.state.rate.split(':');
		let deut = split[2];
		let metal = split[0];
		let crystal = split[1];
		if (resource === RESOURCES.deut) {
			return deut;
		} else if (resource === RESOURCES.metal) {
			return metal;
		} else if (resource === RESOURCES.crystal) {
			return crystal;
		}
	}

	getActiveRate(selectedRate) {
		const { rate } = this.state;
		const isActive = selectedRate === rate;

		return isActive ? 'primary' : 'light';
	}

	getActiveTrade(trade) {
		const { selected } = this.state;
		const isActive = trade === selected;

		return isActive ? 'primary' : 'light';
	}

	setRate(selectedRate) {
		this.setState({ rate: selectedRate });
	}

	getPercent(resource) {
		const { percentCrystal, percentDeut, percentMetal } = this.state;
		let deut = this.roundValue(percentDeut);
		let metal = this.roundValue(percentMetal);
		let crystal = this.roundValue(percentCrystal);

		if (resource === RESOURCES.deut) {
			return {
				percentCrystal: crystal,
				percentDeut: 0,
				percentMetal: metal,
			};
		} else if (resource === RESOURCES.metal) {
			return {
				percentCrystal: crystal,
				percentDeut: deut,
				percentMetal: 0,
			};
		} else if (resource === RESOURCES.crystal) {
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
			<Layout background={background} setBackground={this.setBackground}>
				<Col xs={12}>
					<div className="text-center">
						<h6 className="margin-top text-white">Select ressource</h6>
						<div className="margin-bottom">
							<Trades
								handleOnChange={this.handleOnChange}
								getActiveTrade={this.getActiveTrade}
							/>
						</div>
					</div>
				</Col>
				<Col xs={12}>
					<hr />
					<h6 className="margin-top text-white">Rates</h6>
					<div className="text-center margin-bottom">
						<DefaultRates
							getActiveRate={this.getActiveRate}
							setRate={this.setRate}
						/>
					</div>
					<RateInputs
						getRate={this.getRate}
						handleRateChange={this.handleRateChange}
					/>
				</Col>
				<Col xs={12}>
					<hr />
					<h6 className="margin-top text-white">Percents</h6>
					<Percents
						handlePercentChange={this.handlePercentChange}
						isCurrentRessource={this.isCurrentRessource}
						percentCrystal={percentCrystal}
						percentDeut={percentDeut}
						percentMetal={percentMetal}
					/>
				</Col>

				<Col xs={12}>
					<hr />
					<h6 className="margin-top text-white">Resources</h6>
					<p className={`text-center text-white`}>
						<RateText rate={rate} selected={selected} />
					</p>
					<Resources
						crystal={crystal}
						deut={deut}
						handleResourceChange={this.handleResourceChange}
						isNotCurrentResource={this.isNotCurrentResource}
						metal={metal}
					/>
				</Col>

				<Col xs={12} className="margin-top text-white text-center">
					<PrintResult
						deut={deut}
						metal={metal}
						crystal={crystal}
						selected={selected}
					/>
				</Col>
			</Layout>
		);
	}
}

export default App;
