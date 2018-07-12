import React, { Component } from 'react';
import { array } from 'prop-types';

export default class DropDown extends Component {

  state = {
    languages: []
  }
  static propTypes = {
    languages: array.isRequired
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
      <select ref="userInput" defaultValue="" required> <option value="" disabled>Target Language (en)</option>
          {languages.map(function(user) {
            return <option key={user.language} value={user.name}>{user.name}</option>;
          })}
      </select>
    );
  }
}
