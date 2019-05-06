import React, {Component} from 'react';
import { withSoundCloudAudio } from 'react-soundplayer/addons';
import classes from './SoundPlayer.scss';
import ProgressLoader from '../ProgressLoader/ProgressLoader'


const clientId = 'TBRKIe4bQyw60lg53250YpZsB6tM1OmG';

class SoundPlayer extends Component {
    constructor(props) {
      super(props)
        this.state = {
          playlist: ''
        }

      this.handleBack = this.handleBack.bind(this)
    }

      handleBack() {
        this.props.selectedMood("")
      }

    render() {
      const CustomPlayer = withSoundCloudAudio(props => {
      const { soundCloudAudio, playing, playlist, track, currentTime, duration } = props;

      if (playlist) {
        this.props.handlePlaylistSongExtraction(playlist)
        this.setState({
          playlist
        })
      }

      if (track && currentTime === 0) {
        if (!playing) {
          soundCloudAudio.play()
        }
      }

      const play = () => {
        if (playing) {
          soundCloudAudio.pause();
        } else {
          soundCloudAudio.play();
        }
      };


      if (!track) {
        return <ProgressLoader />;
      }
      
      if (currentTime) {
        if ((currentTime > 120 && currentTime < 120.3)) {
          this.props.onTrackLike('Like');
        }
      }
      
      return (
        <div className={classes.SoundPlayerContainer}>
          <h2 className={classes.TrackName}>{track.title}</h2>
          <h3 className={classes.TrackArtist}>{track.user.username}</h3>
          {this.props.selectedStrain === 'Sativa' ?
            <div className={classes.ButtonContainer}>
              <button onClick={() => play()}>
                {playing ?
                    <img src={require('../../assets/warmPauseBtn.svg')} />
                  : 
                    <img src={require('../../assets/warmPlayBtn.svg')} />
                }
              </button>
              <button {...props} onClick={() => {this.props.handlePlaylistSongExtraction(this.state.playlist, 'Next')}}>
                <img src={require('../../assets/warmForwardBtn.svg')} />
              </button>
            </div>
          :
            <div className={classes.ButtonContainer}>
              <button onClick={() => play()}>
                {playing ?
                    <img src={require('../../assets/coldPauseBtn.svg')} />
                  : 
                    <img src={require('../../assets/coldPlayBtn.svg')} />
                }
              </button>
                <button {...props} onClick={() => {this.props.handlePlaylistSongExtraction(this.state.playlist, 'Next')}}>
                  <img src={require('../../assets/coldForwardBtn.svg')} />
                </button>
            </div>
          }
          <p className="backBtn" onClick={this.handleBack}>BACK</p>
        </div>
      );
    });
    return (
      <CustomPlayer
        resolveUrl={this.props.audioUrl}
        clientId={clientId}
        onReady={() => {
        }}
        onStopTrack={() => {
          this.props.handlePlaylistSongExtraction(this.state.playlist, 'Next')
        }} />
    );
    }
}

export default SoundPlayer