import React from "react";

class PrintResult extends React.Component {
  prettify(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  render() {
    const { metal, crystal, deut, selected } = this.props;
    let text = "";
    if (selected === "deut") {
      text = `Selling ${this.prettify(deut)} deuterium for ${this.prettify(
        metal
      )} metal and ${this.prettify(crystal)} crystal`;
    } else if (selected === "crystal") {
      text = `Selling ${this.prettify(crystal)} crystal for ${this.prettify(
        metal
      )} metal and ${this.prettify(deut)} deuterium`;
    } else if (selected === "metal") {
      text = `Selling ${this.prettify(metal)} metal for ${this.prettify(
        deut
      )} deuterium and ${this.prettify(crystal)} crystal`;
    } else {
      text = "Nothing to sell yet";
    }
    return text;
  }
}

export default PrintResult;
