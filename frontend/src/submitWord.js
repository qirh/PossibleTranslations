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

    // api call to add new word
    //localhost:5000/api/1.0/q?word=hey%20my%20name%20is%20mike&target_lang=fr

    fetch("http://localhost:5000/api/1.0/q?word=" + this.state.word + "&target_lang=" + this.state.language, {method: 'POST'}).then((response) => this.props.onButtonPress())


  }
  handleKeyPress(text) {
    console.log("handleKeyPress = (e) --> " + text.target.value);
    this.setState({
      word: text.target.value
    })
  }
  handleLanguageChange = (lang) => {
    console.log("handleLanguageChange = (e) --> " + lang);
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
