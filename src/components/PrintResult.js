import React from "react";

class PrintResult extends React.Component {
  render() {
    const { metal, crystal, deut, selected } = this.props;
    let text = "";
    if (selected === "deut") {
      text = `Selling ${deut} deuterium for ${metal} metal and ${crystal} crystal`;
    } else if (selected === "crystal") {
      text = `Selling ${crystal} crystal for ${metal} metal and ${deut} deuterium`;
    } else if (selected === "metal") {
      text = `Selling ${metal} metal for ${deut} deuterium and ${crystal} crystal`;
    } else {
      text = "Nothing to sell yet";
    }
    return text;
  }
}

export default PrintResult;
