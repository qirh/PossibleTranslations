import React, { Component } from 'react';
import { array } from 'prop-types';

export default class SubmitWord extends Component {

  state = {
    languages: [],
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

  handleOrganizationIDChange = () => {
  }

  handleKeyPress = (e) => {
  }

  render() {
    return (
      <div className="submit-word-container">
        <p className="submit-word-label">Add a sentence to translate</p>
        <input className="submit-word-input" type="text" ref={input => this.search = input} name="wordInput" placeholder="Sentence to translate" onKeyPress={this.handleKeyPress}></input>
        <button className="submit-word-button" onClick={this.handleOrganizationIDChange}>Find langugae and search</button>
      </div>
    );
  }
}
