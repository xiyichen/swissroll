import React from 'react';
import { Component } from 'react';
import './CircleLoader.scss'
import { getCurrentDate } from './utils'

export default class SubmissionResponse extends Component {
    componentDidMount() {
        setTimeout(function () {
            if (this.props.state.postedConfirmation || this.props.state.postedUnsubscriptionEmail) {
                window.location.href = '/'
            } else if (this.props.form === 'subscription') {
                if (this.props.state.subscriptionResponseStatus === 'success') {
                    this.props.setState({
                        rentMin: 300,
                        rentMax: 1000,
                        earliestStartDate: getCurrentDate(),
                        woko: false,
                        ls: false,
                        wohnen: false,
                        wg: false,
                        studio: false,
                        flat: false,
                        subscriptionEmail: "",
                    })
                }
                this.props.setState({subscriptionFormContent: 'form'});
            } else {
                if (this.props.state.unSubscriptionResponseStatus === 'success') {
                    this.props.setState({
                        unSubscriptionEmail: "",
                    })
                }
                this.props.setState({unSubscriptionFormContent: 'form'});
            }
        }.bind(this), 5000)
    }

    render() {
        let circeClassName = undefined;
        if (this.props.form === 'subscription') {
            circeClassName = (this.props.state.subscriptionResponseStatus === "success") ? "circle-loader success" : "circle-loader failed";
        } else {
            circeClassName = (this.props.state.unSubscriptionResponseStatus === "success") ? "circle-loader success" : "circle-loader failed";
        }

        const responseMessage = (this.props.form === 'subscription') ? <p>{this.props.state.subscriptionResponseMessage}</p> : <p>{this.props.state.unSubscriptionResponseMessage}</p>
        
        return (
            <div>
                <div className={circeClassName}>
                    <div className="status draw" />
                </div>
                {responseMessage}
            </div>
        );
    }
}