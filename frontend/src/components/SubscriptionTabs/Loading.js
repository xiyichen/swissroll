import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import './CircleLoader.scss'

const styles = (theme) => ({
  root: {
      marginTop: 20,
      marginBottom: '0.22em'
  },
});

class Loading extends Component {
  render() {
    const {classes} = this.props;
    return (
    <div>
      <CircularProgress className={classes.root} size={'5em'} thickness={'1'}/>
      <p>{this.props.loadingMessage}</p>
    </div>
    );
  }
}

export default withStyles(styles)(Loading);