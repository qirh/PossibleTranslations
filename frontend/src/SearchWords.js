import React, { Component } from 'react';
import { func } from 'prop-types';

export default class SearchWords extends Component {

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
      <div className="words-search-container">
        <p>Show Words from id</p>
        <input
                                       className="words-input"
                                       type="text"
                                       ref={input => this.search = input}
                                       name="OrganizationIDInput"
                                       placeholder="Organization ID"
                                       onKeyPress={this.handleKeyPress}></input>
        <button className="words-show"
                onClick={this.handleOrganizationIDChange}>SHOW WORDS</button>
      </div>
    );
  }
}
