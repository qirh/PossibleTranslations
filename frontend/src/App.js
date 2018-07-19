import React, { Component } from 'react';
// Components
import SubmitWord from './SubmitWord.js';
import git from './github.svg'

// React table https://react-table.js.org/
import ReactTable from "react-table";
import 'react-table/react-table.css'
// React toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: [],
      width: window.innerWidth,
    }
  }

  notifyUpdate = () => toast.success("Data updated 🙈", { autoClose: 2000 });
  notifyUpdateError = () => toast.error("Failed to update data", { autoClose: 7000 });
  notifyPost = () => toast.success("Word translated 🙊", { autoClose: 2000 });
  notifyPostError = () => toast.error("Failed to translate word", { autoClose: 7000 });
  /*
  notifyLanguage = () => toast.success("Languages fetched 🙉", { autoClose: 2000 });
  notifyLanguageError = () => toast.error("Failed to fetch languages", { autoClose: 7000 });
  */

  getData () {
    fetch('https://PossibleTranslationsAPI.com/api/1.0')
      .then((response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response.json();
      })
      .then(function(words){
        words.reverse();
        this.setState({ words: words })
      }
      .bind(this))
      .catch(function(error) {
        this.notifyUpdate_error()
      }.bind(this));
  }
  refreshData = () => {
    this.getData()
  }
  componentDidMount() {
    this.getData()
    //this.notifyUpdate()
  }
  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  }

  render() {


    /* Mobile First */
    
    const columns = [
      {Header: "Info", columns: [
        {Header: 'Sentence', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]},

      {Header: "Guess #1", columns: [
        {Header: 'Detected Language', accessor: 'lang_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translation', accessor: 'translation_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]}
    ]
    var subText = ""

    /* Tablets */
    if(this.state.width >= 600 && this.state.width < 900) {
      subText = "Enter a sentence in the box below and choose a language"
    }
    /* Desktop */
    else if (this.state.width >= 900){

      subText = "Enter a sentence in the box below and choose a language to translate to"
      columns[0] = {Header: "Info", columns: [
        {Header: 'Sentence', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Language to Translate', accessor: 'target_lang', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]},
      columns.push({Header: "Guess #2", columns: [
        {Header: 'Detected Language', accessor: 'lang_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translation', accessor: 'translation_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]})
    }
    return (
      <div className="app">
        <div className="app-header">
          <h1 className="app-header-title">Possible Translations <a href="https://github.com/qirh/pt"><img className="app-header-git" src={ git } title="Git Repo" alt="Git Repo"></img></a></h1>

          <h3 className="app-header-subtext">{subText}</h3>


        </div>

        <SubmitWord onButtonPress={this.refreshData} wordsProp={this.state.words} onNotifyPost={this.notifyPost} onNotifyPostError={this.notifyPostError} />

        <ReactTable data={this.state.words} columns={columns} defaultPageSize={20} className="-striped -highlight" filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}/>

        <ToastContainer />

      </div>
    )

  }
}
