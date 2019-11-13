import React from "react";

class PrintResult extends React.Component {
  prettify(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  render() {
    const { metal, crystal, deut, selected } = this.props;
    let text = "";
    const deutText = this.prettify(deut);
    const metalText = this.prettify(metal);
    const crystalText = this.prettify(crystal);

    if (selected === "deut") {
      text = `${deutText} deut \n ${metalText} metal \n ${crystalText} crystal`;
    } else if (selected === "crystal") {
      text = `${crystalText} crystal \n ${metalText} metal \n ${deutText} deut`;
    } else if (selected === "metal") {
      text = `${metalText} metal \n ${deutText} deut \n ${crystalText} crystal`;
    } else {
      text = "Nothing to sell yet";
    }
    return text;
  }
}

export default PrintResult;
