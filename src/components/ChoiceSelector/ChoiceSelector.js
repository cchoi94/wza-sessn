import React, { Component } from 'react';
import classes from './ChoiceSelector.scss';
import axios from '../Axios/Axios'
import RadioButtons from './RadioButtons/RadioButtons'
import SoundPlayer from '../SoundPlayer/SoundPlayer'

class ChoiceSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedStrain: '',
      selectedMood: '',
      selectedUrl: '',
      existingSongs: [],
      selectedRateValue: ''
    }

    this.fetchChoiceSelectorItems = this.fetchChoiceSelectorItems.bind(this)
    this.fetchSongs = this.fetchSongs.bind(this)
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

    axios.get('/songs.json').then(response => {
      this.setState({
        existingSongs: response.data
      })
      console.log(this.state.existingSongs)
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
        selectedStrain: strain,
        selectedMood: ''
      })
    }
  }

  selectedMood = (mood) => {
    if (this.state.selectedMood === mood) {
      return
    } else {
      this.setState({
        selectedMood: mood
      }, () => this.fetchSongs())
    }
  }

  fetchSongs = () => {
    this.state.data.forEach(flow => {
      if(flow.title === this.state.selectedStrain) {
        flow.moods.forEach(mood => {
          if(mood.title === this.state.selectedMood) {
            this.setState({
              selectedUrl: mood.playlist_url
            }) 
          }
        })
      }
    })
  }

  handlePlaylistSongExtraction = (playlistInfo, audioAction) => {
    const playlistTracks = playlistInfo.tracks
    let selectAudioUrl;
    const randomIndex = Math.floor(Math.random() * (playlistTracks.length - 1));
    selectAudioUrl = playlistTracks.filter((song, index) => {
      return randomIndex === index
    })
    this.setState({
      selectedUrl: selectAudioUrl[0].permalink_url
    })
    if (audioAction === 'Next') {
      this.setState({
        selectedRateValue: ''
      })
    }
  }

  handleTagsAdded = (rateValue) => {
    this.setState({
      selectedRateValue: rateValue
    })
    const existingSongs = this.state.existingSongs
    let songInfo = {
      url: this.state.selectedUrl,
      tags: {
        strains:{},
        moods:{}
      }
    }

      Object.keys(existingSongs).forEach((song) => {
        if (existingSongs[song].url === this.state.selectedUrl) {
          Object.assign(songInfo, existingSongs[song]);
          if ((Object.keys(songInfo.tags.strains)).indexOf(this.state.selectedStrain) > -1) {
            if (rateValue === 'Like') {
              songInfo.tags.strains[`${this.state.selectedStrain}`] += 1
            }
            else {
              if (songInfo.tags.strains[`${this.state.selectedStrain}`] !== 0) {
                songInfo.tags.strains[`${this.state.selectedStrain}`] -= 1
              }
            }
          }
          if ((Object.keys(songInfo.tags.moods)).indexOf(this.state.selectedMood) > -1) {
            if (rateValue === 'Like') {
              songInfo.tags.moods[`${this.state.selectedMood}`] += 1
            }
            else {
              if (songInfo.tags.moods[`${this.state.selectedMood}`] !== 0) {
                songInfo.tags.moods[`${this.state.selectedMood}`] -= 1
              }
            }
          }
          axios.patch(`/songs/${song}.json`, songInfo)
        } else {
          songInfo.tags.strains[`${this.state.selectedStrain}`] = songInfo.tags.strains[`${this.state.selectedStrain}`] || 1;
          songInfo.tags.moods[`${this.state.selectedMood}`] = songInfo.tags.moods[`${this.state.selectedMood}`] || 1
        }
      })

      if (songInfo.tags.strains[`${this.state.selectedStrain}`] === 1 && songInfo.tags.moods[`${this.state.selectedMood}`] === 1) {
          axios.post('/songs.json', songInfo)
      }

  }

  componentDidMount() {
    this.fetchChoiceSelectorItems()
  }

  test() {
    console.log(this.state.selectedUrl)
  }

  render() {
    const {data, selectedStrain, selectedMood, selectedUrl, selectedRateValue} = this.state

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
          // key = {data.index}
        />
        {selectedStrain !== "" ?
          fetchMoods
          :
          null
        }
        {selectedMood !== "" ?
          <div>
            <SoundPlayer 
              audioUrl = {selectedUrl}
              handlePlaylistSongExtraction = {this.handlePlaylistSongExtraction}
            />
            {selectedRateValue == "" ?
              <RadioButtons 
                choices = {[{title: 'Like'}, {title:'Dislike'}]}
                selectedChoice = {this.handleTagsAdded}
              />
            :
            null
            }
          </div>
          :
          null
        }
        <button onClick={() => this.test()}>test</button>
      </div>
    );
  }
}

export default ChoiceSelector;
