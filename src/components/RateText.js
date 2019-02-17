import React from "react";

const deutText = rate => `Sell deut at ${rate}`;
const metalText = rate => `Sell metal at ${rate}`;
const crystalText = rate => `Sell crystal at ${rate}`;

class RateText extends React.Component {
  render() {
    const { rate, selected } = this.props;
    if (selected === "deut") {
      return <h4>{deutText(rate)}</h4>;
    } else if (selected === "metal") {
      return <h4>{metalText(rate)}</h4>;
    } else if (selected === "crystal") {
      return <h4>{crystalText(rate)}</h4>;
    } else {
      return "Nothing to sell selected";
    }
  }
}

export default RateText;
