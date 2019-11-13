import React from "react";
import copy from "copy-to-clipboard";

class CopyButton extends React.Component {
  handleOnClick() {
    copy(this.props.text);
  }
  render() {
    return (
      <button onClick={e => this.handleOnClick(e)} className="btn btn-success">
        Copy
      </button>
    );
  }
}

export default CopyButton;
