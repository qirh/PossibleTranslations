import React, { Component } from 'react';
import { func } from 'prop-types';

export default class SearchDonors extends Component {

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
      <div className="search-donors-container">
        Show Donors from Organization <input type="text"
                                       ref={input => this.search = input}
                                       name="OrganizationIDInput"
                                       placeholder="Organization ID"
                                       onKeyPress={this.handleKeyPress}></input>
        <button className="show-donors"
                onClick={this.handleOrganizationIDChange}>SHOW DONORS</button>
      </div>
    );
  }
}
