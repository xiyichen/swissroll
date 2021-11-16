import React, { Component } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';
import { withStyles } from '@material-ui/core/styles';
import { getFirstDayOfTheMonthAfterNext, toMmDdYyyy } from './utils'
import './Form.scss';

const DatePickerWrapper = withStyles({
    root: {
        width: '99%',
        marginTop: -1
    }
})(DatePicker);

export default class DateSelecter extends Component {
    render() {
        const handleChange = (event) => {
            var date = new Date(event);
            this.props.onChange(toMmDdYyyy(date));
        }
        
        const latestPossibleStartDate = getFirstDayOfTheMonthAfterNext();
        return (
            <div>
                <p className="label">Earliest Start Date</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePickerWrapper
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        value={this.props.field}
                        disablePast="True"
                        maxDate={latestPossibleStartDate}
                        onChange={handleChange}
                        autoOk={true}
                    />
                </MuiPickersUtilsProvider>
             </div>
    
        );

    }
    
};