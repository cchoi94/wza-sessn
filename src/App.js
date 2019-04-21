import React, { Component } from 'react';
import classes from './App.css';

import ChoiceSelector from './components/ChoiceSelector/ChoiceSelector'

class App extends Component {

  render() {
    return (
      <div className="App">
        <ChoiceSelector />
      </div>
    );
  }
}

export default App;
