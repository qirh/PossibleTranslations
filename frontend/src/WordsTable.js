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
    words.sort(function(a,b) {return a.id - b.id});

    // Create table elements
    var result = []
    var keyID = 1
    words.forEach((word) => {
      if (word.OrganizationId === organization_id || organization_id === 0) {
        result.push(<tr className="words-row" key={keyID}>
                        <td>{word.OrganizationId}</td>
                        <td>{word.FirstName}</td>
                        <td>{word.LastName}</td>
                        <td>{word.EmailAddress}</td>
                        <td>{word.DonationDate}</td>
                        <td>{word.DonationAmount}</td>
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
              <th colSpan="5">{headerText}</th>
              <th><button className="donors-export-button">EXPORT</button></th>
            </tr>
            <tr className="words-column-names">
              <th>Word id</th>
              <th>Word</th>
              <th>Target Language</th>
              <th>Detected Language #1</th>
              <th>Translation #1 </th>
              <th>Donation Amount</th>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}
