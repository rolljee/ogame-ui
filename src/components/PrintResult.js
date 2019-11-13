import React from "react";
import CopyButton from "./CopyButton";

class PrintResult extends React.Component {
  prettify(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  getText(metalText, crystalText, deutText, selected) {
    let text = "";
    if (selected === "deut") {
      text = `Trade:\n${deutText} deut\n\nAgainst:\n${metalText} metal\n${crystalText} crystal`;
    } else if (selected === "crystal") {
      text = `Trade:\n${crystalText} crystal\n\nAgainst:\n${metalText} metal\n${deutText} deut`;
    } else if (selected === "metal") {
      text = `Trade:\n${metalText} metal\n\nAgainst:\n${deutText} deut\n${crystalText} crystal`;
    } else {
      text = "Nothing to sell yet";
    }

    return text;
  }
  render() {
    const { metal, crystal, deut, selected } = this.props;
    const deutText = this.prettify(deut);
    const metalText = this.prettify(metal);
    const crystalText = this.prettify(crystal);
    const text = this.getText(metalText, crystalText, deutText, selected);

    if (selected === "deut") {
      return (
        <React.Fragment>
          <div className="col-xs-12">
            <div>deut: {deutText}</div>
            <div>metal: {metalText}</div>
            <div>crystal: {crystalText}</div>
          </div>
          <div className="col-xs-12 margin-top">
            <CopyButton text={text} />
          </div>
        </React.Fragment>
      );
    } else if (selected === "crystal") {
      return (
        <React.Fragment>
          <div className="col-xs-12">
            <div>crystal: {crystalText}</div>
            <div>metal: {metalText}</div>
            <div>deut: {deutText}</div>
          </div>
          <div className="col-xs-12 margin-top">
            <CopyButton text={text} />
          </div>
        </React.Fragment>
      );
    } else if (selected === "metal") {
      return (
        <React.Fragment>
          <div className="col-xs-12">
            <div>metal: {metalText}</div>
            <div>deut: {deutText}</div>
            <div>crystal: {crystalText}</div>
          </div>
          <div className="col-xs-12 margin-top">
            <CopyButton text={text} />
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default PrintResult;
