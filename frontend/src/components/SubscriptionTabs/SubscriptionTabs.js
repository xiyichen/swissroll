import React, { Component } from 'react';
import SubscriptionCard from './SubscriptionCard'
import UnSubscriptionCard from './UnSubscriptionCard'
import './SubscriptionTabs.css'
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';
import { getCurrentDate, timeout } from './utils'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

class SubscriptionTabs extends Component {
  initializeSubscriptionFormContent = () => {
    if (this.props.state.confirmation) {
      return 'loading';
    }
    return 'form';
  }

  
  initializeSubscriptionLoadingMessage = () => {
    if (this.props.state.confirmation) {
      return 'Confirming Subscription ...';
    }
    return '';
  }

  initializeUnSubscriptionFormContent = () => {
    if (this.props.state.unsubscriptionFromEmail) {
      return 'loading';
    }
    return 'form';
  }

  initializeUnSubscriptionLoadingMessage = () => {
    if (this.props.state.unsubscriptionFromEmail) {
      return 'Unsubscribing ...';
    }
    return '';
  }

  initializeTabValue = () => {
    if (this.props.state.unsubscriptionFromEmail) {
      return 1;
    }
    return 0;
  }

  constructor(props) {
      super(props);
      this.state = {
        tabValue: this.initializeTabValue(),
        subscriptionFormContent: this.initializeSubscriptionFormContent(),
        unSubscriptionFormContent: this.initializeUnSubscriptionFormContent(),
        rentMin: 300,
        rentMax: 1000,
        earliestStartDate: getCurrentDate(),
        woko: false,
        ls: false,
        wohnen: false,
        wg: false,
        studio: false,
        flat: false,
        preferredSitesError: false,
        preferredSitesHelperText: "",
        preferredTypesError: false,
        preferredTypesHelperText: "",
        subscriptionEmail: "",
        subscriptionEmailBoxError: false,
        subscriptionEmailBoxHelperText: "",
        subscriptionResponseStatus: "",
        subscriptionResponseMessage: "",
        subscriptionLoadingMessage: this.initializeSubscriptionLoadingMessage(),
        unSubscriptionEmail: "",
        unSubscriptionEmailBoxError: false,
        unSubscriptionEmailBoxHelperText: "",
        unSubscriptionResponseStatus: "",
        unSubscriptionResponseMessage: "",
        unSubscriptionLoadingMessage: this.initializeUnSubscriptionLoadingMessage(),
        postedConfirmation: false,
        postedUnsubscriptionEmail: false
      };
  }

  handleChange = (event, newValue) => {
    this.setState({'tabValue': newValue});
  };

  handleChangeIndex = (index) => {
    this.setState({'tabValue': index});
  };
  

  handleConfirmationResponse = (data) => {
    this.setState({subscriptionFormContent: 'response', subscriptionResponseStatus: data.status, subscriptionResponseMessage: data.msg});
  };

  handleUnsubscriptionEmailResponse = (data) => {
    this.setState({unSubscriptionFormContent: 'response', unSubscriptionResponseStatus: data.status, unSubscriptionResponseMessage: data.msg});
  }

  render() {
    const { theme } = this.props;

    const link = window.location.href;
    
    if(this.props.state.confirmation && !this.state.postedConfirmation) {
      this.setState({postedConfirmation: true});
      timeout(10000, fetch(link.split('confirm')[0] + 'validate_confirmation_link/',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "link": window.location.href,
        }),
        credentials:'include'
      }).then(response => {
        if (response.ok) {  
            response.json().then(data => {
              setTimeout(function () {
                this.handleConfirmationResponse(data);
              }.bind(this), 1000)
            })
        } else {
            this.handleConfirmationResponse({"status": "error", "msg": 'Server error!'});
        }
      })).catch(function(error) {
        this.handleConfirmationResponse({"status": "error", "msg": 'No response from the server!'});
      });
    } else if (this.props.state.unsubscriptionFromEmail && !this.state.postedUnsubscriptionEmail) {
      this.setState({postedUnsubscriptionEmail: true});
      timeout(10000, fetch(link.split('unsubscribe/email')[0] + 'validate_unsubscription_link/',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "link": window.location.href,
        }),
        credentials:'include'
      }).then(response => {
        if (response.ok) {  
            response.json().then(data => {
              setTimeout(function () {
                this.handleUnsubscriptionEmailResponse(data);
              }.bind(this), 1000)
            })
        } else {
            this.handleUnsubscriptionEmailResponse({"status": "error", "msg": 'Server error!'});
        }
      })).catch(function(error) {
        this.handleUnsubscriptionEmailResponse({"status": "error", "msg": 'No response from the server!'});
      });
    }

    return (
      <div className="tabs">
        <AppBar position="static" style={{ background: '#2f80d1' }}>
          <Tabs
            value={this.state.tabValue}
            onChange={this.handleChange}
            indicatorColor="white"
            textColor="white"
            variant="fullWidth"
          >
            <Tab label="Subscribe" icon={<SubscriptionsIcon />} {...a11yProps(0)} />
            <Tab label="Unsubscribe" icon={<UnsubscribeIcon />} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={this.state.tabValue} index={0} dir={theme.direction}>
          <SubscriptionCard state={this.state} setState={(data) => this.setState(data)}/>
        </TabPanel>
        <TabPanel value={this.state.tabValue} index={1} dir={theme.direction}>
          <UnSubscriptionCard state={this.state} setState={(data) => this.setState(data)}/>
        </TabPanel>
      </div>
    );
  }
}

export default function(props) {
  const theme = useTheme();
  return <SubscriptionTabs {...props} theme={theme} />;
}