import React, { Component } from 'react';
import './App.css';

//Components
import SearchWords from './SearchWords.js';
import WordsTable from './WordsTable.js';

//React table
import ReactTable from "react-table";
import 'react-table/react-table.css'


export default class App extends Component {
  state = {
    words: [],
    organization_id: 0
  }

  componentDidMount() {

    fetch('http://localhost:5000/api')
    .then(res => res.json())
    .then(words => this.setState({ words })
  );
  //console.log(words)
  fetch('http://whalertestbackend-env.73ghfcgu73.us-east-2.elasticbeanstalk.com/donors')
  .then(res => res.json())

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
  const columns = [
    {Header: 'Word', accessor: 'word'},
    {Header: 'Target Language',accessor: 'target_lang', Cell: props => <span className='number'>{props.value}</span>},
    {Header: 'Detected Language #1 ', accessor: 'lang_1', Cell: props => <span className='number'>{props.value}</span>},
    {Header: 'Translation #1 ', accessor: 'translation_1', Cell: props => <span className='number'>{props.value}</span>},
    {Header: 'Detected Language #2 ', accessor: 'lang_2', Cell: props => <span className='number'>{props.value}</span>},
    {Header: 'Detected Language #2 ', accessor: 'translation_2', Cell: props => <span className='number'>{props.value}</span>},
  ]
  return (
    <div className="words-app">
    <h1 className="words-header">Possible Translations</h1>
    <SearchWords onHandleOrganizationIDChange={this.handleOrganizationIDChange}/>

    <ReactTable data={this.state.words} columns={columns} defaultPageSize={10} className="-striped -highlight"/>

    </div>
  );
}
}
