import React, { Component } from 'react';
import './Form.scss';
import DateSelecter from './DateSelecter'
import RangeSlider from './RangeSlider'
import EmailBox from './EmailBox'
import CheckBoxes from './CheckBoxes'
import { validateEmail, getCookie, timeout } from './utils'
import cookie from "react-cookies";

export default class SubscriptionForm extends Component {
    validateInputs = () => {
        let valid = true;

        if (!validateEmail(this.props.state.subscriptionEmail)) {
            valid = false;
            this.props.setState({subscriptionEmailBoxError: true, subscriptionEmailBoxHelperText: 'Invalid Email Address'});
        }

        if (!this.props.state.woko && !this.props.state.ls && !this.props.state.wohnen) {
            valid = false;
            this.props.setState({preferredSitesError: true, preferredSitesHelperText: 'Select At Least One Site'});
        }

        if (!this.props.state.wg && !this.props.state.studio && !this.props.state.flat) {
            valid = false;
            this.props.setState({preferredTypesError: true, preferredTypesHelperText: 'Select At Least One Type'});
        }

        return valid;
    }

    handleSubmissionResponse = (data) => {
        this.props.setState({subscriptionFormContent: 'response', subscriptionResponseStatus: data.status, subscriptionResponseMessage: data.msg});
    };

    handleSubmit = (event) => {
        const valid_input = this.validateInputs();

        if (!valid_input) {
            event.preventDefault();
        } else { 
            // const csrftoken = getCookie('csrftoken');
            // console.log(csrftoken);
            this.props.setState({subscriptionFormContent: 'loading', subscriptionLoadingMessage: 'Submitting ...'});

            timeout(10000, fetch('subscribe/',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "X-CSRFTOKEN'": csrftoken
                },
                body:JSON.stringify({
                    rentmin: this.props.state.rentMin,
                    rentmax: (this.props.state.rentMax === 2100) ? 10000 : this.props.state.rentMax,
                    earlieststartdate: this.props.state.earliestStartDate,
                    email: this.props.state.subscriptionEmail,
                    woko: this.props.state.woko,
                    ls: this.props.state.ls,
                    wohnen: this.props.state.wohnen,
                    wg: this.props.state.wg,
                    studio: this.props.state.studio,
                    flat: this.props.state.flat
                }),
                credentials:'include'
            }).then(response => {
                if (response.ok) {  
                    response.json().then(data => {
                        this.handleSubmissionResponse(data);
                    })
                } else {
                    this.handleSubmissionResponse({"status": "error", "msg": 'Server error!'});
                }
            })).catch(function(error) {
                this.handleSubmissionResponse({"status": "error", "msg": 'No response from the server!'});
            })
        }
    };

    // getCsrfToken = () => { 
    //     fetch("/", {
    //     method:"GET",
    //     headers:{
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     }).then((response)=>response.json())
    //     .then((data)=>{
    //         console.log(data);
    //     })
    // };

    render() {
        // this.getCsrfToken();
        const handleRangeSliderChange = (rentRangeUpdated) => {
            this.props.setState({rentMin: rentRangeUpdated[0], rentMax: rentRangeUpdated[1]});
        }
        
        const handleEmailBoxChange = (emailUpdated) => {
            this.props.setState({subscriptionEmail: emailUpdated});
        }

        const handleDateSelecterChange = (dateUpdated) => {
            this.props.setState({earliestStartDate: dateUpdated})
        }

        const handleCheckBoxChange = (siteList) => {
            this.props.setState(siteList)
        }
        // const csrftoken = getCookie('csrftoken');
        // console.log(csrftoken);

        return (
            <div>
                <div className="form-item">
                    <CheckBoxes sitesGroupError={this.props.state.preferredSitesError} sitesGroupHelperText={this.props.state.preferredSitesHelperText} 
                    typesGroupError={this.props.state.preferredTypesError} typesGroupHelperText={this.props.state.preferredTypesHelperText} 
                    setState={this.props.setState} state={this.props.state} onChange={handleCheckBoxChange}/>
                </div>

                <div className="form-item">
                    <DateSelecter field={this.props.state.earliestStartDate} onChange={handleDateSelecterChange}/>
                </div>
                
                <div className="form-item">
                    <RangeSlider field={[this.props.state.rentMin, this.props.state.rentMax]} onChange={handleRangeSliderChange}/>
                </div>
                
                <div className="form-item">
                    <EmailBox form="subscription" setState={this.props.setState} error={this.props.state.subscriptionEmailBoxError} helperText={this.props.state.subscriptionEmailBoxHelperText} field={this.props.state.subscriptionEmail} onChange={handleEmailBoxChange}/>
                </div>

                <div class="form-item">
                    <button type="button" class="form-button" onClick={this.handleSubmit}>SUBSCRIBE</button>
                </div>
            </div>
            );
        }
};