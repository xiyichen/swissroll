import React, {Component} from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
      marginBottom: -3
  },
  formControl: {
      width: '50%',
      display: 'inline',
  },
  formLabel: {
      fontSize: 'auto',
      marginBottom: 3,
      color: 'black'
  },
  label: {
      fontSize: 'auto',
      marginLeft: -2
  }
});

class CheckBoxes extends Component {
  
  constructor(props) {
      super(props);
      this.state = {
        'woko_disabled': !this.props.state.wg && !this.props.state.studio,
        'ls_disabled': !this.props.state.studio,
        'wohnen_disabled': !this.props.state.wg && !this.props.state.studio && !this.props.state.flat
      }
  }

  render() {
    const {classes} = this.props;
    let woko = this.props.state.woko;
    let ls = this.props.state.ls;
    let wohnen = this.props.state.wohnen;
    let wg = this.props.state.wg;
    let studio = this.props.state.studio;
    let flat = this.props.state.flat;
    let {woko_disabled, ls_disabled, wohnen_disabled} = this.state;

    const updateCheckStatus = (siteList) => {
      this.props.onChange(siteList);
    }

    const handleChangeSites = (event) => {
      if (this.props.sitesGroupError && event.target.checked) {
        this.props.setState({preferredSitesError: false, preferredSitesHelperText: ""});
      }
      updateCheckStatus({[event.target.name]: event.target.checked})
    };

    const handleChangeTypes = (event) => {
      if (event.target.name === 'wg') {
          if (event.target.checked) {
            this.setState({'woko_disabled': false, 'wohnen_disabled': false})
          } else {
              if (!studio) {
                  if (flat) {
                      this.setState({'woko_disabled': true});
                      woko = false;
                  } else {
                      this.setState({'woko_disabled': true, 'wohnen_disabled': true})
                      woko = false;
                      wohnen = false;
                  }
              }
          }
      } else if (event.target.name === 'studio') {
          if (event.target.checked) {
              this.setState({'woko_disabled': false, 'ls_disabled': false, 'wohnen_disabled': false});
          } else {
              if (!wg) {
                  if (flat) {
                      this.setState({'woko_disabled': true, 'ls_disabled': true});
                      woko = false;
                      ls = false;
                  } else {
                      this.setState({'woko_disabled': true, 'ls_disabled': true, 'wohnen_disabled': true});
                      woko = false;
                      ls = false;
                      wohnen = false;
                  }
              } else {
                  this.setState({'ls_disabled': true});
                  ls = false;
              }
          }
      } else {
          if (event.target.checked) {
              this.setState({'wohnen_disabled': false});
          } else {
              if (!wg && !studio) {
                  this.setState({'wohnen_disabled': true});
                  wohnen = false;
              }
          }
      }
      
      if (this.props.sitesGroupError && event.target.checked) {
        this.props.setState({preferredTypesError: false, preferredTypesHelperText: ""});
      }

      updateCheckStatus({'woko': woko, 'ls': ls, 'wohnen': wohnen, [event.target.name]: event.target.checked});    
    };

    return (
      <div className={classes.root}>
      <FormControl required error={this.props.typesGroupError} component="fieldset" className={classes.formControl}>
        <FormLabel className={classes.formLabel} component="legend">Preferred Types</FormLabel>
        <FormGroup>
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={wg} onChange={handleChangeTypes} name="wg" />}
            label="Rooms in WGs">
          </FormControlLabel>
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={studio} onChange={handleChangeTypes} name="studio" />}
            label="Studios"
          />
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={flat} onChange={handleChangeTypes} name="flat" />}
            label="Entire Flats"
          />
        </FormGroup>
        <FormHelperText>{this.props.typesGroupHelperText}</FormHelperText>
      </FormControl>
      <FormControl required error={this.props.sitesGroupError} component="fieldset" className={classes.formControl}>
        <FormLabel className={classes.formLabel} component="legend">Preferred Sites</FormLabel>
        <FormGroup>
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={woko} disabled={woko_disabled} onChange={handleChangeSites} name="woko" />}
            label="woko.ch"
          />
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={ls} disabled={ls_disabled} onChange={handleChangeSites} name="ls" />}
            label="livingscience.ch"
          />
          <FormControlLabel classes={{ label: classes.label }}
            control={<Checkbox size="small" color="primary" checked={wohnen} disabled={wohnen_disabled} onChange={handleChangeSites} name="wohnen" />}
            label="wohnen.ethz.ch"
          />
        </FormGroup>
        <FormHelperText>{this.props.sitesGroupHelperText}</FormHelperText>
      </FormControl>
      
    </div>
    );
  }
};

export default withStyles(styles)(CheckBoxes);