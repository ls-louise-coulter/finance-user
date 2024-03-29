import React, { Component } from 'react';
import axios from 'axios';
import { config } from '../Constants';
import './LoanList.css';
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

    sortLoans() {
        function hasApplied(business) {
            if (business.loan) return business;
        }
        const cloneLoans = [...this.state.loansCollection];
        const result = cloneLoans.filter(hasApplied);
        for(let i = 0; i <= result.length -1; i++)  {
            for (let j = 0; j < result.length-1; j++) {
                const loan1 = result[j];
                const loan2 = result[j+1];
                if( (loan2.loan.status[loan2.loan.status.length-1].createdAt) > loan1.loan.status[loan1.loan.status.length-1].createdAt) {
                    result[j]  = loan2;
                    result[j+1] = loan1;
                }
            }
        }
        return (
            result
        )
    }

    getAllBusinessesWithLoans() {
        const sorted = this.sortLoans();
        return sorted.map((data, i) => {
            if (data.loan) {
                const arrayLength = data.loan.status.length;
                let statusBadge = "";
                if ((data.loan.status[arrayLength - 1].currentStatus) === "Approved") {
                    statusBadge = <p class="btn btn-outline-success disabled status-badge">{data.loan.status[arrayLength - 1].currentStatus}</p>
                }
                else if ((data.loan.status[arrayLength - 1].currentStatus) === "Rejected") {
                    statusBadge = <p class="btn btn-outline-danger disabled status-badge">{data.loan.status[arrayLength - 1].currentStatus}</p>
                }
                else {
                    statusBadge = <p class="btn btn-outline-secondary disabled status-badge">{data.loan.status[arrayLength - 1].currentStatus}</p>
                }
                return <tr>
                    <td className="app-id">{data._id}</td>
                    <td className="business-name"><a href={`/admin/loans/${data._id}`}>{data.businessName}</a></td>
                    <td>${data.loan.amount}</td>
                    <td>{new Date(data.loan.status[arrayLength - 1].createdAt).toLocaleString('en-GB')}</td>
                    <td>{statusBadge}</td>
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
                        <td>Application ID</td>
                            <td>Business Name</td>
                            <td>Amount Requested</td>
                            <td>Most Recent Update</td>
                            <td>Application Status</td>
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