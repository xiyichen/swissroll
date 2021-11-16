import React, {Component} from 'react';
import SubscriptionTabs from './components/SubscriptionTabs/SubscriptionTabs'
import './Homepage.css'
import { ifConfirmationLink, ifUnsubscriptionLink } from './components/SubscriptionTabs/utils'

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmation: ifConfirmationLink(window.location.href),
      unsubscriptionFromEmail: ifUnsubscriptionLink(window.location.href)
    }
  }


  render() {
    return (
      <div className="frame">
        <p className="intro">As you may already know, apartments are very scarce in Zurich. Many apartments are reserved on a first come first serve basis. We build this notification system to promptly notify you if any housing options become available. 
          We currently support <a href="http://woko.ch/">WOKO</a>, <a href="http://www.livingscience.ch/">Living Science</a>, and <a href="https://wohnen.ethz.ch/">Housing Office of University / ETH Zurich</a>.
          Consider subscribing below with your preferences and email address. Once you have confirmed your subscription, you will start receiving notifications from us.</p>
        <p className="intro" style = {{marginTop: '10px'}}>If you find any issue with this website, please <a href = "mailto: swissrollnotifications@gmail.com">send an email</a> to let the developer know. If you think it would be a good idea to track some other sites, also feel free to drop in an email!</p>
        <SubscriptionTabs state={this.state} setState={this.setState}/>
      </div>
    );
  }
  
}

export default Homepage;