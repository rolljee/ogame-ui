import Ogame from "ogamejs";
import React, { Component } from "react";
import "./App.css";
import Select from "./components/Select";

class App extends Component {
  constructor() {
    super();
    this.state = {
      deut: 0,
      percentDeut: 0,
      metal: 0,
      percentMetal: 60,
      crystal: 0,
      percentCrystal: 40,
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

  printResult(sell) {
    if (sell === "deut") {
      this.sellDeut();
    } else if (sell === "metal") {
      this.sellMetal();
    } else if (sell === "crystal") {
      this.sellCrystal();
    }
  }
  handleChange = name => event => {
    this.setState({ [name]: Number(event.target.value) });
    this.printResult(name);
  };

  render() {
    return (
      <div className="container">
        <div className="col-xs-12">
          <Select />
        </div>
      </div>
    );
  }
}

export default App;
