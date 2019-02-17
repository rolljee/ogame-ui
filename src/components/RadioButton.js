import React from "react";

class RadioButton extends React.Component {
  render() {
    return (
      <label className="radio" htmlFor={this.props.id}>
        <input
          type="radio"
          data-toggle="radio"
          className="custom-radio"
          id={this.props.id}
          name={this.props.value}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <span className="icons">
          <span className="icon-unchecked" />
          <span className="icon-checked" />
        </span>
        {this.props.text}
      </label>
    );
  }
}

export default RadioButton;
