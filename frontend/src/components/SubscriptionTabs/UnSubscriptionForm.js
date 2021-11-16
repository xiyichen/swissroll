import React, { Component } from 'react';

import './Form.scss';
import EmailBox from './EmailBox'
import { validateEmail, timeout } from './utils'

export default class UnSubscriptionForm extends Component {
    handleSubmissionResponse = (data) => {
        this.props.setState({unSubscriptionFormContent: 'response', unSubscriptionResponseStatus: data.status, unSubscriptionResponseMessage: data.msg});
    };

    handleSubmit = (event) => {
        if (!validateEmail(this.props.state.unSubscriptionEmail)) {
            event.preventDefault();
            this.props.setState({unSubscriptionEmailBoxError: true, unSubscriptionEmailBoxHelperText: 'Invalid Email Address'});
        } else {
            this.props.setState({unSubscriptionFormContent: 'loading', unSubscriptionLoadingMessage: 'Submitting ...'});
            timeout(10000, fetch('unsubscribe/',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    email: this.props.state.unSubscriptionEmail
                }),
                credentials:'include'
            }).then(response => {
                if (response.ok) {  
                    response.json().then(data => {
                        setTimeout(function () {
                            this.handleSubmissionResponse(data);
                        }.bind(this), 1000)
                    })
                } else {
                    this.handleSubmissionResponse({"status": "error", "msg": 'Server error!'});
                }
            })).catch(function(error) {
                this.handleSubmissionResponse({"status": "error", "msg": 'No response from the server!'});
            })
        }
    };

    render() {
        const handleEmailBoxChange = (emailUpdated) => {
            this.props.setState({unSubscriptionEmail: emailUpdated});
        }

        return (
            <form>
                <div className="form-item">
                <EmailBox form="unSubscription" setState={this.props.setState} error={this.props.state.unSubscriptionEmailBoxError} helperText={this.props.state.unSubscriptionEmailBoxHelperText} field={this.props.state.unSubscriptionEmail} onChange={handleEmailBoxChange}/>
                </div>
                <div class="form-item">
                    <button type="button" class="form-button" onClick={this.handleSubmit}>UNSUBSCRIBE</button>
                </div>
            </form>
            );
        }
};