import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import {validateEmail} from './utils'

const TextFieldWrapper = withStyles({
  root: {
    width: '100%'
  },
})(TextField);

export default class EmailBox extends Component {
  render() {
    const handleChange = (event) => {
      this.props.onChange(event.target.value);
      if (this.props.form === 'subscription') {
        if (validateEmail(event.target.value)) {
          this.props.setState({subscriptionEmailBoxError: false, subscriptionEmailBoxHelperText: ""});
        }
      } else {
        if (validateEmail(event.target.value)) {
          this.props.setState({unSubscriptionEmailBoxError: false, unSubscriptionEmailBoxHelperText: ""});
        }
      }
    }
    return (
      <TextFieldWrapper error={this.props.error} helperText={this.props.helperText} 
      type="email" value={this.props.field} onChange={handleChange} id="outlined-basic" label="Email Address" variant="outlined" />
    );
  }; 
};