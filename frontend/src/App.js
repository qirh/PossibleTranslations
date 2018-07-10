import React, { Component } from 'react';
import './App.css';

//Components
import SearchDonors from './SearchWords.js';
import WordsTable from './WordsTable.js';

export default class App extends Component {
  state = {
    words: [],
    organization_id: 0
  }

  componentDidMount() {
    fetch('http://whalertestbackend-env.73ghfcgu73.us-east-2.elasticbeanstalk.com/donors')
      .then(res => res.json())
      .then(words => this.setState({ words }));
  }

  handleOrganizationIDChange = (user_input) => {
    var new_organization_id = 0
    if (!isNaN(user_input) && user_input !== "") {
      new_organization_id = parseFloat(user_input)
    }
    this.setState(prevState => ({
      organization_id: new_organization_id,
    }))
  }

  render() {
    return (
      <div className="words-app">
        <h1 className="words-header">FIND MY WORD!</h1>
        <SearchDonors onHandleOrganizationIDChange={this.handleOrganizationIDChange} />
        <WordsTable words={this.state.words}
                     organization_id={this.state.organization_id}/>
      </div>
    );
  }
}
