import React, { Component } from 'react';
import { func } from 'prop-types';


export default class DropDown extends Component {

  state = {
    languages: [],
  }

  static propTypes = {
    onHandleLanguageChange: func.isRequired,
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
  handleLanguageChange = (e) => {
    this.props.onHandleLanguageChange(e.target.value)
  }

  render() {
    const { languages } = this.state;

    return (
      <select className="language-drop-down" onChange={this.handleLanguageChange}>
        <option defaultValue="en">Target Language (en)</option>
        {languages.map(function(l) {
          return <option key={l.language} value={l.language}>{l.name}</option>;
        })}
      </select>
    );
  }
}
