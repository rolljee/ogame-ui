/**
 * Npm import
 */
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Ogame from "ogamejs";

/**
 * Local import
 */
import AppBar from "./AppBar";
import "./App.css";

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

  setDeutSellingState() {
    const { deut, percentMetal, percentCrystal, rate } = this.state;
    const { metal, crystal } = Ogame.sellDeut(
      deut,
      percentMetal,
      percentCrystal,
      rate
    );
    this.setState({ metal, crystal });
  }
  printResult(sell) {
    if (sell === "deut") {
      this.setDeutSellingState();
    } else if (sell === "metal") {
      // this.setMetalSellingState();
    } else if (sell === "crystal") {
      // this.setCrystalSellingState();
    }
  }
  handleChange = name => event => {
    this.setState({ [name]: Number(event.target.value) });
    this.printResult(name);
  };

  render() {
    return (
      <div>
        <AppBar />
        <TextField
          id="filled-number"
          label="Deuterium"
          value={this.state.deut}
          onChange={this.handleChange("deut")}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="filled"
        />
        <TextField
          id="filled-number"
          label="Metal"
          value={this.state.metal}
          onChange={this.handleChange("metal")}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="filled"
        />
        <TextField
          id="filled-number"
          label="Crystal"
          value={this.state.crystal}
          onChange={this.handleChange("crystal")}
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          margin="normal"
          variant="filled"
        />
      </div>
    );
  }
}

export default App;
