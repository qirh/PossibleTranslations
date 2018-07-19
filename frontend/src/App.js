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
  notifyPostError = (text) => toast.error("Error: " + text, { autoClose: 7000 });
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
      {Header: "Input", columns: [
        {Header: 'Sentence', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]},
      {Header: "Guess", columns: [
        {Header: 'Origin Language', accessor: 'lang_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translation', accessor: 'translation_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}
      ]}]

    if (this.state.width < 900) {
      return (
        <div className="app">

          <div className="app-header">
            <h1 className="app-header-title">Possible Translations</h1>
          </div>

          <SubmitWord onButtonPress={this.refreshData} wordsProp={this.state.words} onNotifyPost={this.notifyPost} onNotifyPostError={this.notifyPostError} stateWidth={this.state.width}></SubmitWord>

          <ReactTable data={this.state.words} columns={columns} defaultPageSize={5} className="-striped -highlight" filterable defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value} showPageSizeOptions={false}/>

          <ToastContainer></ToastContainer>

          <div class="footer">
            <p id="footer_text" title="powered by ☕">Made by <a href="https://saleh.alghusson.com">Saleh</a><a href="https://github.com/qirh/pt"><img className="app-header-git" src={ git } title="Git Repo" alt="Git Repo"></img></a></p>
          </div>

        </div>
      );
    }
    else { // this.state.width >= 900
      var subText = "Enter a sentence in the box below and choose a language to translate to"
      columns[0] = {Header: "Input", columns: [
        {Header: 'Sentence', accessor: 'word', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translate to', accessor: 'target_lang', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}]}

      columns[1] = {Header: "Guess #1", columns: [
        {Header: 'Guessed Language', accessor: 'lang_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translation', accessor: 'translation_1', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}]}

      columns.push({Header: "Guess #2", columns: [
        {Header: 'Guessed Language', accessor: 'lang_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)},
        {Header: 'Translation', accessor: 'translation_2', filterMethod: (filter, row) => row[filter.id].startsWith(filter.value)}]})

      return (
        <div className="app">

          <div className="app-header">
            <h1 className="app-header-title">Possible Translations</h1>
            <h3 className="app-header-subtext">{subText}</h3>
          </div>

          <SubmitWord onButtonPress={this.refreshData} wordsProp={this.state.words} onNotifyPost={this.notifyPost} onNotifyPostError={this.notifyPostError} stateWidth={this.state.width}></SubmitWord>

          <ReactTable data={this.state.words} columns={columns} defaultPageSize={10} className="-striped -highlight" filterable
            defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}/>

          <ToastContainer></ToastContainer>

          <div class="footer">
            <p id="footer_text" title="powered by ☕">Connettiti con me <a href="mailto:saleh@alghusson.com">saleh@alghusson.com</a><a href="https://github.com/qirh/pt"><img className="app-header-git" src={ git } title="Git Repo" alt="Git Repo"></img></a></p>
          </div>

        </div>
      );
    }
  }
}
