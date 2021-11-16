import React, { Component } from 'react';
import SubscriptionForm from './SubscriptionForm';
import Loading from './Loading';
import SubmissionResponse from './SubmissionResponse';

export default class SubscriptionCard extends Component {
    render() {
        let cardContent = undefined;
        if (this.props.state.subscriptionFormContent === 'form') {
            cardContent = <SubscriptionForm state={this.props.state} setState={this.props.setState}/>;
        } else if (this.props.state.subscriptionFormContent === 'loading') {
            cardContent = <Loading loadingMessage={this.props.state.subscriptionLoadingMessage}/>
        } else if (this.props.state.subscriptionFormContent === 'response') {
            cardContent = <SubmissionResponse form="subscription" state={this.props.state} setState={this.props.setState}/>
        }

        return (
            <div className="card">
                {cardContent}
            </div>
        );    
    }
};