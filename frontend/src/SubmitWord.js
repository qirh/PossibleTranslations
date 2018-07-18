import React, { Component } from 'react';
import { func, array } from 'prop-types';
import { FadeLoader } from 'react-spinners';
import { CSVLink } from 'react-csv';

// Components
import DropDown from './DropDown.js';

export default class SubmitWord extends Component {

  state = {
    word: "",
    language: "en",
    loading: false
  }
  static propTypes = {
    onButtonPress: func.isRequired,
    onNotifyPost: func.isRequired,
    onNotifyPostError: func.isRequired,
    wordsProp: array.isRequired,
  }

  buttonPress = () => {
    fetch('https://PossibleTranslationsAPI.com/api/1.0/q?word=' + this.state.word + '&target_lang=' + this.state.language,
      {method: 'POST'})
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      this.setState({ loading: true })
      return response.json();
    })
    .then(response => this.props.onButtonPress())
    .then(function(response){
      this.clearItems();
      this.props.onNotifyPost();
    }
    .bind(this))
    .catch(function(error) {

      this.props.onNotifyPostError();
    }.bind(this));
  }
  handleKeyPress(text) {
    this.setState({
      word: text.target.value
    })
  }
  handleLanguageChange = (lang) => {
    this.setState(prevState => ({
      language: lang
    }));
  }
  clearItems() {
    this.setState({loading: false, language: "en"})
    this.refs.inputRef.value = "";
  }

  render() {
    return (
      <div className="submit-word-container">
        <div className="submit-word-main">
          <input className="submit-word-input" ref="inputRef" type="text" name="wordInput" placeholder="  Sentence to translate" onChange={this.handleKeyPress.bind(this)}></input>
          <DropDown onHandleLanguageChange={this.handleLanguageChange} defaultValue={this.state.language}></DropDown>
          <button className="submit-word-button" onClick={this.buttonPress}>Detect language and translate</button>
          <CSVLink className="export-button" filename="PossibleTranslations.csv" data={this.props.wordsProp}>Export CSV</CSVLink>
        </div>
        <div className='sweet-loading'>
          <FadeLoader color={'#123abc'} loading={this.state.loading}></FadeLoader>
        </div>
      </div>
    );
  }
}
