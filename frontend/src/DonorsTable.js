import React, { Component } from 'react';
import { array, number } from 'prop-types'

export default class DonorsTable extends Component {

  static propTypes = {
    donors: array.isRequired,
    organization_id: number
  }

  static defaultProps = {
    donors: [],
    organization_id: 0
  }

  generateTableRows = (donors, organization_id) => {
    // Sort by id
    donors.sort(function(a,b) {return a.id - b.id});

    // Create table elements
    var result = []
    var keyID = 1
    donors.forEach((donor) => {
      if (donor.OrganizationId === organization_id || organization_id === 0) {
        result.push(<tr className="donors-row" key={keyID}>
                        <td>{donor.OrganizationId}</td>
                        <td>{donor.FirstName}</td>
                        <td>{donor.LastName}</td>
                        <td>{donor.EmailAddress}</td>
                        <td>{donor.DonationDate}</td>
                        <td>{donor.DonationAmount}</td>
                       </tr>)
        keyID += 1
      }
    })
    return result
  }

  render() {
    const {
      donors,
      organization_id
    } = this.props

    var tableRows = this.generateTableRows(donors, organization_id)

    return (
      <div className="donors-table-container">
        <table className="donors-table">
          <tbody>
            <tr className="donors-header-row">
              <th>OrganizationID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Donation Date</th>
              <th>Donation Amount</th>
            </tr>
            {tableRows}
          </tbody>
        </table>
      </div>
    );
  }
}
