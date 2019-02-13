import React, { Component } from "react";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Metal"
    };
  }
  handleOnClick(e) {
    this.setState({ selected: e.target.text });
  }
  render() {
    return (
      <div className="btn-group btn-group-hg">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          {this.state.selected} <span className="caret" />
        </button>
        <ul className="dropdown-menu" role="menu">
          <li>
            <a href="/" onClick={e => this.handleOnClick(e)}>
              Metal
            </a>
          </li>
          <li className="divider" />
          <li>
            <a href="/" onClick={e => this.handleOnClick(e)}>
              Crystal
            </a>
          </li>
          <li className="divider" />
          <li>
            <a href="/" onClick={e => this.handleOnClick(e)}>
              Deut
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Select;
