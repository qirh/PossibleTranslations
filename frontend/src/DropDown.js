import React, { Component } from 'react';
import { func } from 'prop-types';

const defaultLang = "en";
export default class DropDown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      languages: [],
      language: defaultLang
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  static defaultProps = {
    languages: [],
    language: defaultLang
  }
  static propTypes = {
    onHandleLanguageChange: func.isRequired
  }
  componentDidMount() {
    fetch('http://PossibleTranslations.com/api/1.0/languages')
      .then(res => res.json())
      .then(languages => this.setState({ languages })
    );
  }
  handleLanguageChange(e) {
    console.log("here --> ");
    this.setState({language: e.target.value});
    this.props.onHandleLanguageChange(e.target.value);
  }
  render() {
    const { languages } = this.state;

    return (
      <select className="language-drop-down" value={this.state.language} onChange={this.handleLanguageChange}>

        {this.state.languages.map(function(l) {
          return <option key={l.language} value={l.language}>Translate to ({l.name})</option>;
        })}
      </select>
    );
  }
}
