import React from 'react';
import PropTypes from 'prop-types';
import classes from './ChoiceButtons.scss'

class ChoiceButtons extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        selectedValue: '',
      };

    this.handleBack = this.handleBack.bind(this)

  }

  handleBack() {
    this.props.selectedStrain("")
  }

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
    this.props.selectedChoice(event.target.value)
  };

  render() {

    const { choices, buttonStyle } = this.props;

    const choiceButtons = choices.map(choice => {
      console.log(this.props)
      return (
        <div>
          <button 
            name = {choice.title}
            value = {choice.title}
            onClick={this.handleChange}
            className={`${classes[choice.style]} ${classes[buttonStyle]}`}
          > {choice.title} </button>
        </div>
      )
    })

    return (
        <div className={classes.ChoiceBtnContainer}>
          {choiceButtons}
          {this.props.selectedStrain !== "" ?
            <p className="backBtn" onClick={this.handleBack}>BACK</p>
            :
            null
          }
        </div>
    );
  }
}

ChoiceButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default ChoiceButtons;