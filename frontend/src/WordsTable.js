import React, { Component } from 'react';
import { array, number } from 'prop-types'

export default class WordsTable extends Component {

  static propTypes = {
    words: array.isRequired,
    organization_id: number
  }

  static defaultProps = {
    words: [],
    organization_id: 0
  }

  generateTableRows = (words, organization_id) => {
    // Sort by id
    console.log(words);
    words.sort(function(a, b){
      if(a.word < b.word) return -1;
      if(a.word > b.word) return 1;
      return 0;
    })
    console.log(words);
    // Create table elements
    var result = []
    var keyID = 1
    words.forEach((word) => {
      if (word.OrganizationId === organization_id || organization_id === 0) {
        result.push(<tr className="words-row" key={keyID}>
                        <td>{word.word}</td>
                        <td>{word.target_lang}</td>
                        <td>{word.lang_1}</td>
                        <td>{word.translation_1}</td>
                        <td>{word.lang_2}</td>
                        <td>{word.translation_1}</td>
                       </tr>)
        keyID += 1
      }
    })
    return result
  }

  getHeaderText = (organization_id) => {
    if (organization_id === 0) {
      return "ALL WORDS"
    }
    else {
      return "WORD WITH ID: " + organization_id.toString()
    }
  }

  render() {
    const {
      words,
      organization_id
    } = this.props

    var tableRows = this.generateTableRows(words, organization_id)
    var headerText = this.getHeaderText(organization_id)

    return (
      <div className="words-table-container">
        <table className="words-table">
          <tbody>
            <tr className="words-header-row">
              <th colSpan="6">{headerText}</th>
              <th><button className="words-export-button">EXPORT</button></th>
            </tr>
            <tr className="words-column-names">
              <th>Word</th>
              <th>Target Language</th>
              <th>Detected Language #1</th>
              <th>Translation #1</th>
              <th>Detected Language #2</th>
              <th>Translation #2</th>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}
