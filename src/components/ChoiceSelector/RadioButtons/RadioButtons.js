import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'

const styles = {
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
};

class RadioButtons extends React.Component {
  state = {
    selectedValue: '',
  };

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
    this.props.selectedChoice(event.target.value)
  };

  render() {
    const { classes, choices, selectedChoice } = this.props;

    const radioButtons = choices.map(choice => {
      return (
        <div>
          <span>{choice.title}</span>
          <Radio 
            name = {choice.title}
            value = {choice.title}
            checked = {this.state.selectedValue === choice.title}
            onChange={this.handleChange}
          />
        </div>
      )
    })

    return (
      <div>
        {radioButtons}
      </div>
    );
  }
}

RadioButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtons);