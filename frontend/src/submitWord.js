import React, { Component } from 'react';

// Components
import DropDown from './DropDown.js';

export default class SubmitWord extends Component {

  render() {
    return (
      <div className="submit-word-container">
        <p className="submit-word-label">Add a sentence to translate</p>

        <input className="submit-word-input" type="text" ref={input => this.search = input} name="wordInput" placeholder="Sentence to translate" onKeyPress={this.handleKeyPress}></input>

        <DropDown/>

        <button className="submit-word-button" onClick={this.handleOrganizationIDChange}>Find langugae</button>
      </div>
    );
  }
}
