import React, { Component } from 'react';
import classes from './Layout.scss';
import ChoiceSelector from '../../components/ChoiceSelector/ChoiceSelector';
import SoundPlayer from '../../components/SoundPlayer/SoundPlayer'


class Layout extends Component {
  constructor() {
    super()
    this.state = {
      selectedStrain: "",
      selectedMood: ""
    }

  }

  render() {

    return (
      <div>
        <ChoiceSelector 
          selectedStrain = {this.state.selectedStrain}
          selectedMood = {this.state.selectedMood}
        />
      </div>
    );
  }
}

export default Layout;
