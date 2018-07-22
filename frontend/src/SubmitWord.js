import React, { Component } from 'react';
import { array, func, number } from 'prop-types';
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
    stateWidth: number.isRequired
  }

  buttonPress = () => {
    fetch('https://PossibleTranslationsAPI.com/api/v1/q?word=' + this.state.word + '&target_lang=' + this.state.language,
      {method: 'POST'})
    .then((response) => {
      if (!response.ok) {
        throw response.json();
      }
      this.setState({ loading: true })
      return response.json();
    })
    .then(response => this.props.onButtonPress())
    .then(function(response) {
      this.clearItems();
      this.props.onNotifyPost();
    }
    .bind(this))
    .catch(function(error) {
      error.then((response) => {
          this.props.onNotifyPostError(response.Error);
       });
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

    if(this.props.stateWidth < 900) {
      return (
        <div className="submit">

          <div className="submit-main">

            <div>
              <input className="submit-main-input" ref="inputRef" type="text" name="wordInput" placeholder="  Sentence to translate" onChange={this.handleKeyPress.bind(this)}></input>

              <button className="submit-main-button-find" onClick={this.buttonPress}>Translate</button>
            </div>
            <div><br></br></div>
            <div>
              <DropDown className="submit-main-drop" onHandleLanguageChange={this.handleLanguageChange} defaultValue={this.state.language} submitStateWidth={this.props.stateWidth}></DropDown>
            </div>
          </div>

          <div className='submit-sweet-loading'>
            <FadeLoader color={'#123abc'} loading={this.state.loading}></FadeLoader>
          </div>

        </div>
      );
    }
    else { //this.props.stateWidth >= 900
      return (
        <div className="submit">

          <div className="submit-main">
            <input className="submit-main-input" ref="inputRef" type="text" name="wordInput" placeholder="  Sentence to translate" onChange={this.handleKeyPress.bind(this)}></input>

            <DropDown className="submit-main-drop" onHandleLanguageChange={this.handleLanguageChange} defaultValue={this.state.language} submitStateWidth={this.props.stateWidth}></DropDown>

            <button className="submit-main-button-find" onClick={this.buttonPress}>Detect language and translate</button>

            <CSVLink className="submit-main-button-export" filename="PossibleTranslations.csv" data={this.props.wordsProp}>Export CSV</CSVLink>
          </div>

          <div className='submit-sweet-loading'>
            <FadeLoader color={'#123abc'} loading={this.state.loading}></FadeLoader>
          </div>

        </div>
      );
    }
  }
}
