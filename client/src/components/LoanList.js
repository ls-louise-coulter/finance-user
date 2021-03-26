import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Constants';
var url = config.url.API_URL;

class LoanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loansCollection: []
        };
    }

    componentDidMount() {
        const user = JSON.parse(localStorage["user"]);
        const token = user.token;
        axios({
            method: 'get',
            url: `${url}/business`,
            headers: {token: token }
        })
            .then(res => {
                this.setState({ loansCollection: res.data });
                console.log(res.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    getAllBusinessesWithLoans() {
        return this.state.loansCollection.map((data, i) => {
            if (data.loan) {
                const arrayLength = data.loan.status.length;
                const statusId = data.loan.status.statusId.toString().substring(0, 8);
                var timestamp = new Date(parseInt(statusId, 16) * 1000);
                timestamp = timestamp.toDateString();
                /*
                if current status is         
                'No Loan Application Submitted',
                'Submitted by Merchant',
                'Documentation Requested',
                'Documentation Submitted', 
                'Pending Approval',
                'Approved',
                'Rejected'
                */
                return <tr>
                    <td><a href={`/dashboard/loans/${data._id}`}>{data.businessName}</a></td>
                    <td>${data.loan.amount}</td>
                    <td>{data.loan.status[arrayLength-1].currentStatus}</td>
                    <td>{timestamp}</td>
                </tr>;
            }
        });
    }

    render() {
        return (
            <div className="wrapper-users">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <td>Merchant </td>
                            <td>Amount Requested</td>
                            <td>Application Status</td>
                            <td>Most Recent Update</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getAllBusinessesWithLoans()}
                    </tbody>
                </table>
            </div>

        )
    }
}

export default LoanList;