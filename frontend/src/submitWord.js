import React, { Component } from 'react';
import { func } from 'prop-types';

export default class submitWord extends Component {

  static propTypes = {
    onHandleOrganizationIDChange: func.isRequired
  }

  static defaultProps = {
    onHandleOrganizationIDChange: () => null
  }

  handleOrganizationIDChange = () => {
    this.props.onHandleOrganizationIDChange(this.search.value);
    this.search.value = ""
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleOrganizationIDChange()
    }
  }

  render() {
    return (
      <div className="submit-word-container">
        <p class="submit-word-label">Add a sentence to translate</p>
        <input className="submit-word-input" type="text" ref={input => this.search = input} name="wordInput" placeholder="Sentence to translate" onKeyPress={this.handleKeyPress}></input>
        <button className="submit-word-button" onClick={this.handleOrganizationIDChange}>Find langugae and search</button>
      </div>
    );
  }
}
