import React, { Component } from 'react';
import { func, string } from 'prop-types';

// Components
import DropDown from './DropDown.js';

export default class SubmitWord extends Component {

  static propTypes = {
    onButtonPress: func.isRequired,
    wordToSearch: string.isRequired,
    language: string.isRequired
  }

  static defaultProps = {
    onButtonPress: () => null,
    language: 'en'
  }
  refreshData = () => {
    this.props.onButtonPress("1");
  }
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.props.onButtonPress("2- " + e.key);
    }
    else {
      this.props.onButtonPress("3- " + e.key);
    }
  }

  render() {
    return (
      <div className="submit-word-container">
        <p className="submit-word-label">Add a sentence to translate</p>

        <input className="submit-word-input" type="text" ref={input => this.search = input} name="wordInput" placeholder="Sentence to translate" onKeyPress={this.handleKeyPress}></input>

        <DropDown />

        <button className="submit-word-button" onClick={this.refreshData}>Find langugae</button>
      </div>
    );
  }
}
