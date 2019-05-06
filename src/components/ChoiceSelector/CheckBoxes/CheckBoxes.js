import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';

class Checkboxes extends Component {
  
  state = {
    selectedValue: '',
  };

   handleChange = name => event => {
    // this.setState({ [name]: event.target.checked });
    this.props.checked = true
  };

  render() {
    const { choices, checked } = this.props;

    const checkBox = choices.map(choice => {
      return (
        <div>
          <span>{choice.title}</span>
          <Checkbox
          name = 'checked'
          checked={checked}
          onChange={this.handleChange()}
          value={choice.title}
        />
        </div>
      )
    })

    return (
      <div>
        {checkBox}
      </div>
    );
  }
}

export default Checkboxes;