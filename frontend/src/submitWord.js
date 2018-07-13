import React, { Component } from 'react';
import { func } from 'prop-types';

// Components
import DropDown from './DropDown.js';

export default class SubmitWord extends Component {

  state = {
    word: "",
    language: "en"
  }

  static propTypes = {
    onButtonPress: func.isRequired,
  }
  static defaultProps = {
    onButtonPress: () => null,
  }

  buttonPress = () => {
    fetch('http://PossibleTranslations.com/api/1.0/q?word=' + this.state.word + '&target_lang=' + this.state.language,
      {method: 'POST'})
    .then((response) => this.props.onButtonPress())
  }
  handleKeyPress(text) {
    this.setState({
      word: text.target.value
    })
  }
  handleLanguageChange = (lang) => {
    this.setState(prevState => ({
      language: lang
    }))
  }

  render() {
    return (
      <div className="submit-word-container">
        <p className="submit-word-label">Add a sentence to translate</p>
        <input className="submit-word-input" type="text" name="wordInput" placeholder="Sentence to translate" onChange={this.handleKeyPress.bind(this)}></input>
        <DropDown onHandleLanguageChange={this.handleLanguageChange} defaultValue={this.state.language} />
        <button className="submit-word-button" onClick={this.buttonPress}>Find langugae</button>
      </div>
    );
  }
}
