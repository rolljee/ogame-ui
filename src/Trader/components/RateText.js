import React from "react";
import OgameLib from "ogamejs";

// ogamejs 2.1.x is published as a CommonJS module with a nested default export.
const Ogame = OgameLib.default || OgameLib;

class RateText extends React.Component {
  render() {
    const { rate, selected } = this.props;
    const { rateMetal, rateCrystal, rateDeut } = Ogame.Trader.parseRate(
      rate,
      selected
    );
    if (selected === "deut") {
      return `${rateDeut} deut = ${rateMetal} metal and ${rateCrystal} crystal`;
    } else if (selected === "metal") {
      return `${rateMetal} metal = ${rateDeut} deut and ${rateCrystal} crystal`;
    } else if (selected === "crystal") {
      return `${rateCrystal} crystal = ${rateDeut} deut and ${rateMetal} metal`;
    } else {
      return "Nothing selected";
    }
  }
}

export default RateText;
