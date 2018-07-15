import React, { Component } from 'react';
import { string, func } from 'prop-types';


export default class DropDown extends Component {

  state = {
    languages: [],
  }

  static propTypes = {
    onHandleLanguageChange: func.isRequired,
    defaultValue: string.isRequired
  }

  componentDidMount() {
    fetch('http://PossibleTranslations.com/api/1.0/languages')
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
        <option defaultValue={this.props.defaultValue}>Translate to ({this.props.defaultValue})</option>
        {languages.map(function(l) {
          return <option key={l.language} value={l.language}>{l.name}</option>;
        })}
      </select>
    );
  }
}
