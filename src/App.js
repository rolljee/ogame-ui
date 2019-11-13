import Ogame from "ogamejs";
import React, { Component } from "react";

/** Components import */
import NumberIntput from "./components/NumberInput";
import PrintResult from "./components/PrintResult";
import RadioButton from "./components/RadioButton";
import RateText from "./components/RateText";
import Title from "./components/Title";

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
      selected: "deut",
      rate: "2:1.5:1"
    };
  }

  sellDeut() {
    const { deut, percentMetal, percentCrystal, rate } = this.state;
    const { metal, crystal } = Ogame.sellDeut(
      deut,
      percentMetal,
      percentCrystal,
      rate
    );
    this.setState({ metal, crystal });
  }

  sellMetal() {
    const { metal, percentDeut, percentCrystal, rate } = this.state;
    const { crystal, deut } = Ogame.sellMetal(
      metal,
      percentDeut,
      percentCrystal,
      rate
    );
    this.setState({ deut, crystal });
  }

  sellCrystal() {
    const { crystal, percentDeut, percentMetal, rate } = this.state;
    const { metal, deut } = Ogame.sellCrystal(
      crystal,
      percentDeut,
      percentMetal,
      rate
    );
    this.setState({ metal, deut });
  }

  printResult() {
    if (this.state.selected === "deut") {
      this.sellDeut();
    } else if (this.state.selected === "metal") {
      this.sellMetal();
    } else if (this.state.selected === "crystal") {
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
    if (resource === "deut") {
      this.setState({ deut: value }, this.printResult);
    } else if (resource === "metal") {
      this.setState({ metal: value }, this.printResult);
    } else if (resource === "crystal") {
      this.setState({ crystal: value }, this.printResult);
    }
  }

  handleRateChange(e, resource) {
    const value = e.target.value;
    const split = this.state.rate.split(":");
    let deut = split[2];
    let metal = split[0];
    let crystal = split[1];
    let rate = `${metal}:${crystal}:${deut}`;

    if (resource === "deut") {
      rate = `${metal}:${crystal}:${value}`;
    } else if (resource === "metal") {
      rate = `${value}:${crystal}:${deut}`;
    } else if (resource === "crystal") {
      rate = `${metal}:${value}:${deut}`;
    }
    this.setState({ rate }, this.printResult);
  }

  roundToHundred(percent, modifiedResource) {
    const currentResource = this.state.selected;
    if (currentResource === "deut" && modifiedResource === "metal") {
      return {
        percentCrystal: 100 - percent
      };
    } else if (currentResource === "deut" && modifiedResource === "crystal") {
      return {
        percentMetal: 100 - percent
      };
    } else if (currentResource === "metal" && modifiedResource === "deut") {
      return {
        percentCrystal: 100 - percent
      };
    } else if (currentResource === "metal" && modifiedResource === "crystal") {
      return {
        percentDeut: 100 - percent
      };
    } else if (currentResource === "crystal" && modifiedResource === "metal") {
      return {
        percentDeut: 100 - percent
      };
    } else if (currentResource === "crystal" && modifiedResource === "deut") {
      return {
        percentMetal: 100 - percent
      };
    }
  }

  handlePercentChange(e, resource) {
    const percent = this.roundValue(Number(e.target.value));

    if (resource === "deut") {
      this.setState(
        { percentDeut: percent, ...this.roundToHundred(percent, "deut") },
        this.printResult
      );
    } else if (resource === "metal") {
      this.setState(
        { percentMetal: percent, ...this.roundToHundred(percent, "metal") },
        this.printResult
      );
    } else if (resource === "crystal") {
      this.setState(
        { percentCrystal: percent, ...this.roundToHundred(percent, "crystal") },
        this.printResult
      );
    }
  }

  getRate(resource) {
    const split = this.state.rate.split(":");
    let deut = split[2];
    let metal = split[0];
    let crystal = split[1];
    if (resource === "deut") {
      return deut;
    } else if (resource === "metal") {
      return metal;
    } else if (resource === "crystal") {
      return crystal;
    }
  }

  roundValue(percent) {
    if (percent > 100) {
      return 100;
    }

    return percent;
  }

  getPercent(resource) {
    const { percentCrystal, percentDeut, percentMetal } = this.state;
    let deut = this.roundValue(percentDeut);
    let metal = this.roundValue(percentMetal);
    let crystal = this.roundValue(percentCrystal);

    if (resource === "deut") {
      return {
        percentCrystal: crystal,
        percentDeut: 0,
        percentMetal: metal
      };
    } else if (resource === "metal") {
      return {
        percentCrystal: crystal,
        percentDeut: deut,
        percentMetal: 0
      };
    } else if (resource === "crystal") {
      return {
        percentCrystal: 0,
        percentDeut: deut,
        percentMetal: metal
      };
    }
  }

  isCurrentRessource(value) {
    return value === this.state.selected;
  }

  isNotCurrentResource(resource) {
    return this.state.selected !== resource;
  }

  render() {
    const { metal, crystal, deut, selected, rate } = this.state;
    const { percentMetal, percentCrystal, percentDeut } = this.getPercent(
      selected
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
              checked={this.isCurrentRessource("metal")}
              onChange={e => this.handleOnChange(e, "metal")}
            />
            <RadioButton
              id="crystal"
              text="crystal"
              value="selected"
              checked={this.isCurrentRessource("crystal")}
              onChange={e => this.handleOnChange(e, "crystal")}
            />
            <RadioButton
              id="deut"
              text="deut"
              value="selected"
              checked={this.isCurrentRessource("deut")}
              onChange={e => this.handleOnChange(e, "deut")}
            />
          </div>

          {/* CHANGE RATES */}
          <div className="col-xs-6">
            <div className="col-xs-4">
              metal
              <NumberIntput
                value={this.getRate("metal")}
                onChange={e => this.handleRateChange(e, "metal")}
                placeholder="metal"
              />
            </div>
            <div className="col-xs-4">
              crystal
              <NumberIntput
                value={this.getRate("crystal")}
                onChange={e => this.handleRateChange(e, "crystal")}
                placeholder="crystal"
              />
            </div>
            <div className="col-xs-4">
              deuterium
              <NumberIntput
                value={this.getRate("deut")}
                onChange={e => this.handleRateChange(e, "deut")}
                placeholder="deut"
              />
            </div>

            {/* CHANGE PERCENT */}
            <div className="col-xs-12">
              <hr />
              <div className="col-xs-4">
                %metal
                <NumberIntput
                  value={percentMetal}
                  onChange={e => this.handlePercentChange(e, "metal")}
                  placeholder="metal"
                  disabled={this.isCurrentRessource("metal")}
                  maxValue="100"
                />
              </div>
              <div className="col-xs-4">
                %crystal
                <NumberIntput
                  value={percentCrystal}
                  onChange={e => this.handlePercentChange(e, "crystal")}
                  placeholder="crystal"
                  disabled={this.isCurrentRessource("crystal")}
                  maxValue="100"
                />
              </div>
              <div className="col-xs-4">
                %deut
                <NumberIntput
                  value={percentDeut}
                  onChange={e => this.handlePercentChange(e, "deut")}
                  placeholder="deut"
                  disabled={this.isCurrentRessource("deut")}
                  maxValue="100"
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
              <NumberIntput
                value={metal}
                onChange={e => this.handleResourceChange(e, "metal")}
                placeholder="metal"
                disabled={this.isNotCurrentResource("metal")}
              />
            </div>
            <div className="col-xs-4">
              crystal
              <NumberIntput
                value={crystal}
                onChange={e => this.handleResourceChange(e, "crystal")}
                placeholder="crystal"
                disabled={this.isNotCurrentResource("crystal")}
              />
            </div>
            <div className="col-xs-4">
              deut
              <NumberIntput
                value={deut}
                onChange={e => this.handleResourceChange(e, "deut")}
                placeholder="deut"
                disabled={this.isNotCurrentResource("deut")}
              />
            </div>
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
    );
  }
}

export default App;
