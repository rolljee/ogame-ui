import Ogame from "ogamejs";
import React, { Component } from "react";

/** Components import */
import Title from "./components/Title";
import RateText from "./components/RateText";
import RadioButton from "./components/RadioButton";
import TextInput from "./components/TextInput";
import PrintResult from "./components/PrintResult";

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
    console.log("sellDeut", deut, percentMetal, percentCrystal, rate);
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
    console.log(value, resource);
    if (resource === "deut") {
      this.setState({ deut: value });
      console.log(this.state);
    } else if (resource === "metal") {
      this.setState({ metal: value });
    } else if (resource === "crystal") {
      this.setState({ crystal: value });
    }
    this.printResult();
  }

  handleRateChange(e, resource) {}

  handlePercentChange(e, resource) {
    const value = Number(e.target.value);
    if (resource === "deut") {
      this.setState({ percentDeut: value });
    } else if (resource === "metal") {
      this.setState({ percentMetal: value });
    } else if (resource === "crystal") {
      this.setState({ percentCrystal: value });
    }
    this.printResult();
  }

  getRate(resource) {
    const rate = Ogame.parseRate(this.state.rate);
    const { rateMetal, rateCrystal, rateDeut } = rate;
    if (resource === "deut") {
      return rateDeut;
    } else if (resource === "metal") {
      return rateMetal;
    } else if (resource === "crystal") {
      return rateCrystal;
    }
  }

  getPercent(resource) {
    const { percentCrystal, percentDeut, percentMetal } = this.state;
    if (resource === "deut") {
      return {
        percentMetal,
        percentCrystal,
        percentDeut: 0
      };
    } else if (resource === "metal") {
      return {
        percentMetal: 0,
        percentCrystal,
        percentDeut
      };
    } else if (resource === "crystal") {
      return {
        percentMetal,
        percentCrystal: 0,
        percentDeut
      };
    }
  }

  isSelected(value) {
    return value === this.state.selected;
  }

  render() {
    const { metal, crystal, deut, selected, rate } = this.state;
    const { percentMetal, percentCrystal, percentDeut } = this.getPercent(
      selected
    );
    return (
      <div className="container">
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
              checked={this.isSelected("metal")}
              onChange={e => this.handleOnChange(e, "metal")}
            />
            <RadioButton
              id="crystal"
              text="crystal"
              value="selected"
              checked={this.isSelected("crystal")}
              onChange={e => this.handleOnChange(e, "crystal")}
            />
            <RadioButton
              id="deut"
              text="deut"
              value="selected"
              checked={this.isSelected("deut")}
              onChange={e => this.handleOnChange(e, "deut")}
            />
          </div>

          {/* CHANGE RATES */}
          <div className="col-xs-6">
            <div className="text-center">
              <RateText rate={rate} selected={selected} />
            </div>
            <div className="col-xs-4">
              metal
              <TextInput
                value={this.getRate("metal")}
                onChange={e => this.handleRateChange(e, "metal")}
                placeholder="metal"
              />
            </div>
            <div className="col-xs-4">
              crystal
              <TextInput
                value={this.getRate("crystal")}
                onChange={e => this.handleRateChange(e, "crystal")}
                placeholder="crystal"
              />
            </div>
            <div className="col-xs-4">
              deuterium
              <TextInput
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
                <TextInput
                  value={percentMetal}
                  onChange={e => this.handlePercentChange(e, "metal")}
                  placeholder="metal"
                />
              </div>
              <div className="col-xs-4">
                %crystal
                <TextInput
                  value={percentCrystal}
                  onChange={e => this.handlePercentChange(e, "crystal")}
                  placeholder="crystal"
                />
              </div>
              <div className="col-xs-4">
                %deut
                <TextInput
                  value={percentDeut}
                  onChange={e => this.handlePercentChange(e, "deut")}
                  placeholder="deut"
                />
              </div>
            </div>
          </div>

          {/* CHANGE RESOURCES TO TRADE */}
          <div className="col-xs-12">
            <hr />
            <h4>Resources</h4>
            <div className="col-xs-4">
              <TextInput
                value={deut}
                onChange={e => this.handleResourceChange(e, "deut")}
                placeholder="deut"
              />
            </div>
            <div className="col-xs-4">
              <TextInput
                value={metal}
                onChange={e => this.handleResourceChange(e, "metal")}
                placeholder="metal"
              />
            </div>
            <div className="col-xs-4">
              <TextInput
                value={crystal}
                onChange={e => this.handleResourceChange(e, "crystal")}
                placeholder="crystal"
              />
            </div>
          </div>

          {/* PRINT THE RESULT */}
          <div className="col-xs-12">
            <div className="text-center">
              <h4>Result</h4>
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
