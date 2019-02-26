import React from "react";
import Ogame from "ogamejs";

class RateText extends React.Component {
  render() {
    const { rate, selected } = this.props;
    const { rateMetal, rateCrystal, rateDeut } = Ogame.parseRate(
      rate,
      selected
    );
    if (selected === "deut") {
      return `${rateDeut} deut = ${rateMetal} of metal and ${rateCrystal} crystal`;
    } else if (selected === "metal") {
      return `${rateMetal} metal = ${rateDeut} of deut and ${rateCrystal} crystal`;
    } else if (selected === "crystal") {
      return `${rateCrystal} crystal = ${rateDeut} of deut and ${rateMetal} metal`;
    } else {
      return "Nothing selected";
    }
  }
}

export default RateText;
