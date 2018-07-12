import React, { Component } from 'react';

// Style
import './App.css';

// Components
import SubmitWord from './SubmitWord.js';

// React table https://react-table.js.org/
import ReactTable from "react-table";
import 'react-table/react-table.css'

export default class App extends Component {

  state = {
    words: [],
  }

  componentDidMount() {
    fetch('http://localhost:5000/api/1.0')
    .then(res => res.json())
    .then(words => this.setState({ words })
    );
  }

/*
handleOrganizationIDChange = (user_input) => {
  var new_organization_id = 0
  if (!isNaN(user_input) && user_input !== "") {
    new_organization_id = parseFloat(user_input)
  }
  this.setState(prevState => ({
    organization_id: new_organization_id,
  }))
}
*/


render() {
  const columns = [
    {Header: "Info", columns: [
      {Header: 'Word', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
      {Header: 'Target Language', accessor: 'target_lang', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
    ]},

    {Header: "Guess #1", columns: [
      {Header: 'Detected Language', accessor: 'lang_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
      {Header: 'Translation', accessor: 'translation_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
    ]},
    {Header: "Guess #2", columns: [
      {Header: 'Detected Language', accessor: 'lang_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
      {Header: 'Translation', accessor: 'translation_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
    ]}
  ]
  return (
    <div className="words-app">
    <h1 className="words-header">Possible Translations</h1>

    <SubmitWord/>

    <ReactTable data={this.state.words} columns={columns} defaultPageSize={10} className="-striped -highlight" filterable defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}/>

    </div>
  );
}
}
