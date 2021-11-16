import React, { Component } from 'react';
import UnSubscriptionForm from './UnSubscriptionForm';
import Loading from './Loading';
import SubmissionResponse from './SubmissionResponse';

export default class UnSubscriptionCard extends Component {
    render() {
        let cardContent = undefined;
        if (this.props.state.unSubscriptionFormContent === 'form') {
            cardContent = <UnSubscriptionForm state={this.props.state} setState={this.props.setState}/>;
        } else if (this.props.state.unSubscriptionFormContent === 'loading') {
            cardContent = <Loading loadingMessage={this.props.state.unSubscriptionLoadingMessage}/>
        } else if (this.props.state.unSubscriptionFormContent === 'response') {
            cardContent = <SubmissionResponse form="unSubscription" state={this.props.state} setState={this.props.setState}/>
        }

        return (
            <div className="card">
                {cardContent}
            </div>
        );    
    }
};