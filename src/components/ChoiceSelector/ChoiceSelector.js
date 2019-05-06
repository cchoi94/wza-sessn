import React, { Component } from 'react';
import classes from './ChoiceSelector.scss';
import axios from '../Axios/Axios'
import ChoiceButtons from './ChoiceButtons/ChoiceButtons'
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
      selectedRateValue: '',
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
    }).catch (
      error => {
        console.log(error)
      })
  }

  selectedStrain = (strain) => {
    this.setState({
      selectedStrain: strain,
      selectedMood: ''
    })
  }

  selectedMood = (mood) => {
      this.setState({
        selectedMood: mood
      }, () => this.fetchSongs())
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
            if (rateValue === 'Like' && this.state.selectedRateValue === "") {
              songInfo.tags.strains[`${this.state.selectedStrain}`] += 1
            } else if (rateValue === 'Like' && this.state.selectedRateValue !== 'Dislike') {
              songInfo.tags.strains[`${this.state.selectedStrain}`] += 2
            } else if (rateValue === 'Dislike' && this.state.selectedRateValue !== 'Like') {
              songInfo.tags.strains[`${this.state.selectedStrain}`] -= 2
            }
            else {
              if (songInfo.tags.strains[`${this.state.selectedStrain}`] !== 0) {
                songInfo.tags.strains[`${this.state.selectedStrain}`] -= 1
              }
            }
          }
          if ((Object.keys(songInfo.tags.moods)).indexOf(this.state.selectedMood) > -1) {
            if (rateValue === 'Like' && this.state.selectedRateValue === "") {
              songInfo.tags.moods[`${this.state.selectedMood}`] += 1
            } else if (rateValue === 'Like' && this.state.selectedRateValue !== 'Dislike') {
              songInfo.tags.strains[`${this.state.selectedMood}`] += 2
            } else if (rateValue === 'Dislike' && this.state.selectedRateValue !== 'Like') {
              songInfo.tags.strains[`${this.state.selectedMood}`] -= 2
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
      
      // when deleteing song database, comment out this if condition to get song on
      if (songInfo.tags.strains[`${this.state.selectedStrain}`] === 1 && songInfo.tags.moods[`${this.state.selectedMood}`] === 1) {
          axios.post('/songs.json', songInfo)
      }
    


    this.setState({
      selectedRateValue: rateValue
    })

  }

  componentDidMount() {
    this.fetchChoiceSelectorItems()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.selectedRateValue !== '') {
      return false
    } else {
      return true
    }
  }

  render() {
    const {data, selectedStrain, selectedMood, selectedUrl} = this.state

    const fetchMoods =
      data.map(flow => {
        if (flow.title === this.state.selectedStrain) {
          return (
            <div>
              <p className="Subtitle topGutter center">What you feeling?</p>
              <ChoiceButtons 
                choices = {flow.moods}
                selectedChoice = {this.selectedMood}
                selectedStrain = {this.selectedStrain}
                buttonStyle = 'secondaryBtn'
              />
            </div>
          )
        }
      })
 
    return (
      <div>
        {!selectedStrain
        &&
        <div className={classes.HeroBox}>
          <div className={classes.HeaderContainer}>
            <p className="Title">WZA</p>
            <p className="Subtitle">what you hitting?</p>
          </div>
            <ChoiceButtons 
              choices = {data}
              selectedStrain = {selectedStrain}
              selectedChoice = {this.selectedStrain}
              buttonStyle = 'primaryBtn'
            />
        </div>
        }
        {!selectedMood
        &&
        fetchMoods
        }
        <div className={classes.ChoiceSelectorContainer}>
          {selectedMood !== "" ?
            <div>
              <SoundPlayer 
                audioUrl = {selectedUrl}
                handlePlaylistSongExtraction = {this.handlePlaylistSongExtraction}
                onTrackLike = {this.handleTagsAdded}
                selectedMood = {this.selectedMood}
                selectedStrain = {this.state.selectedStrain}
              />
            </div>
            :
            null
          }
        </div>
      </div>
    );
  }
}

export default ChoiceSelector;
