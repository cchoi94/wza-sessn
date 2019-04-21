import React, { Component } from 'react';
import classes from './ChoiceSelector.scss';
import axios from '../Axios/Axios'
import RadioButtons from './RadioButtons/RadioButtons'

class ChoiceSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedStrain: "",
      selectedMood: ""
    }

    this.fetchChoiceSelectorItems = this.fetchChoiceSelectorItems.bind(this)
  }

  fetchChoiceSelectorItems() {
    axios.get('/flows.json').then(response => {
      this.setState({
        data: response.data,
      })
    }).catch (
      error => {
        console.log(error)
      })
  }

  selectedStrain = (strain) => {
    if (this.state.selectedStrain === strain) {
      return
    } else {
      this.setState({
        selectedStrain: strain
      })
    }
  }

  selectedMood = (mood) => {
    if (this.state.selectedMood === mood) {
      return
    } else {
      this.setState({
        selectedMood: mood
      })
    }
  }

  componentDidMount() {
    this.fetchChoiceSelectorItems()
  }

  test() {
    console.log(this.state.selectedMood)
  }

  render() {
    const {data, selectedStrain, selectedMood} = this.state

    const fetchMoods =
      data.map(flow => {
        if (flow.title === this.state.selectedStrain) {
          return (
            <RadioButtons 
              choices = {flow.moods}
              selectedChoice = {this.selectedMood}
            />
          )
        }
      })

    return (
      <div className={classes.ChoiceSelectorContainer}>
        <RadioButtons 
          choices = {data}
          selectedChoice = {this.selectedStrain}
        />
        {selectedStrain !== "" ?
          fetchMoods
          :
          null
        }
        
        {/* <button onClick={() => this.test()}>test</button> */}
      </div>
    );
  }
}

export default ChoiceSelector;
