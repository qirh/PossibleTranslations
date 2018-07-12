import React, { Component } from 'react';
import { func, string } from 'prop-types';

// Components
import DropDown from './DropDown.js';

export default class SubmitWord extends Component {

  state = {
    language: 'en',
  }

  static propTypes = {
    onButtonPress: func.isRequired,
  }
  static defaultProps = {
    onButtonPress: () => null,
  }

  buttonPress = () => {
    // api call to add new word
    //localhost:5000/api/1.0/q?word=hey%20my%20name%20is%20mike&target_lang=fr
    this.props.onButtonPress("1");
  }
  handleKeyPress = (e) => {
    console.log(e)
  }
  handleLanguageChange = (e) => {
    console.log(e)
  }

  render() {
    return (
      <div className="submit-word-container">
        <p className="submit-word-label">Add a sentence to translate</p>

        <input className="submit-word-input" type="text" ref={input => this.search = input} name="wordInput" placeholder="Sentence to translate" onKeyPress={this.handleKeyPress}></input>

        <DropDown onHandleLanguageChange={this.handleLanguageChange} />

        <button className="submit-word-button" onClick={this.buttonPress}>Find langugae</button>
      </div>
    );
  }
}
