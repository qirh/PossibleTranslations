import React, { Component } from 'react';

export default class DropDown extends Component {

  state = {
    languages: []
  }

  componentDidMount() {
    fetch('http://localhost:5000/api/1.0/languages')
    .then(res => res.json())
    .then(languages => this.setState({ languages })
    );
  }

  static defaultProps = {
    languages: []
  }

  render() {
    const { languages } = this.state;

    return (
      <select className="language-drop-down"> <option disabled defaultValue="en">Target Language (en)</option>
          {languages.map(function(l) {
            return <option key={l.language} value={l.language}>{l.name}</option>;
          })}
      </select>
    );
  }
}
