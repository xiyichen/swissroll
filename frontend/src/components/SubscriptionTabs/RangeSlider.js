import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import './Form.scss';

const RangeSliderWrapper = withStyles({
    root: {
      color: 'rgb(55, 129, 207)',
      maxWidth: '96%',
      height: 10
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    track: {
      height: 13.5,
      borderRadius: 4
    },
    rail: {
      height: 13.5,
      borderRadius: 4,
      width: '100%'
    },
})(Slider);

export default class RangeSlider extends Component {
    render() {
      const handleChange = (event, newRentRangeInput) => {
        const newRentRangeWithLimit = [Math.min(newRentRangeInput[0], this.props.field[1] - 400), Math.max(newRentRangeInput[1], this.props.field[0] + 400)]
        if (newRentRangeWithLimit[0] !== this.props.field[0] || newRentRangeWithLimit[1] !== this.props.field[1]) {
          this.props.onChange(newRentRangeWithLimit);
        }
      }

      const rentMinLabel = this.props.field[0];
      const rentMaxLabel = (this.props.field[1] === 2100) ? "More than 2000" : this.props.field[1];
      return (
        <div>
          <p className="label">Rent Range: {rentMinLabel} - {rentMaxLabel} CHF</p>
          <RangeSliderWrapper
            min={300}
            max={2100}
            step={100}
            value={this.props.field}
            onChange={handleChange}
            valueLabelDisplay="off"
            aria-labelledby="range-slider"
          />
        </div>
      );
  };
};