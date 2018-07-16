import React, { Component } from 'react';


// Components
import SubmitWord from './SubmitWord.js';

// React table https://react-table.js.org/
import ReactTable from "react-table";
import 'react-table/react-table.css'

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: [],
    }
    //this.getData = this.getData.bind(this);
  }


  getData () {
    fetch('http://PossibleTranslations.com/api/1.0')
      .then(res => res.json())
      .then(function(words){
        words.reverse();
        this.setState({ words })
      }.bind(this));
  }
  refreshData = () => {
    this.getData()
  }
  componentDidMount() {
    this.getData()
  }

  render() {
    const columns = [
      {Header: "Info", columns: [
        {Header: 'Sentence', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Language to Translate', accessor: 'target_lang', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
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
        <div className="words-header">
          <h1>Possible Translations</h1>
          <h3>Enter a sentence in the box below and choose a language to translate to. The website will query Google Translate to get a translation and list it in the table below</h3>
        </div>

        <SubmitWord onButtonPress={this.refreshData} />

        <ReactTable data={this.state.words} columns={columns} defaultPageSize={20} className="-striped -highlight" filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}/>

      </div>
    );
  }
}
