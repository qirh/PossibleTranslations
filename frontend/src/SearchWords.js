import React, { Component } from 'react';
import { func } from 'prop-types';

export default class SearchWords extends Component {

  static propTypes = {
    onHandleWordIDChange: func.isRequired
  }

  static defaultProps = {
    onHandleWordIDChange: () => null
  }

  handleWordIDChange = () => {
    this.props.onHandleWordIDChange(this.search.value);
    this.search.value = ""
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleWordIDChange()
    }
  }

  render() {
    return (
      <div className="words-search-container">
        <p>Search for a word</p>
        <input className="words-input" type="text" ref={input => this.search = input} name="WordIDInput" placeholder="Word" onKeyPress={this.handleKeyPress}></input>
        <button className="words-show" onClick={this.handleWordIDChange}>SHOW WORDS</button>
      </div>
    );
  }
}
