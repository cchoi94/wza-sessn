// import React, { Component } from 'react'
// import ReactPlayer from 'react-player'
 
// class SoundPlayer extends Component {
//   constructor(props) {
//     super(props)
//   }

//   render () {
//     const { audioUrl } = this.props
//     return (
//     <div>
//       <ReactPlayer 
//         url={audioUrl} 
//         volume={1}
//         playing={true}
//       controls />

//     </div>
//               // KT6UCHXC9iNnI8wn4UUfwMSlAPe4Z8zx
//               // TBRKIe4bQyw60lg53250YpZsB6tM1OmG
              
//     )
//   }
// }

// export default SoundPlayer

import React, {Component} from 'react';
import { withSoundCloudAudio } from 'react-soundplayer/addons';
import { Progress, PlayButton, Timer, VolumeControl, Icons, NextButton, PrevButton } from 'react-soundplayer/components'


const clientId = 'TBRKIe4bQyw60lg53250YpZsB6tM1OmG';

class SoundPlayer extends Component {

    state = {
      playlist: ''
    }

    // handleAudioUrlChange = (playlist) => {
    //   this.props.handlePlaylistSongExtraction(playlist)
    // }

    render() {
      const CustomPlayer = withSoundCloudAudio(props => {
      const { soundCloudAudio, playing, playlist, track, currentTime, duration } = props;
      const {
        SoundCloudLogoSVG,
        PlayIconSVG,
        PauseIconSVG,
        NextIconSVG,
        PrevIconSVG
      } = Icons;

      if (playlist) {
        this.props.handlePlaylistSongExtraction(playlist)
        this.setState({
          playlist
        })
      }

      const play = () => {
        if (playing) {
          soundCloudAudio.pause();
        } else {
          soundCloudAudio.play();
        }
      };

      if (!track) {
        return <div>Loading...</div>;
      }

      return (
        <div>
          <h2>{track.title}</h2>
          <h3>{track.user.username}</h3>
          <button onClick={() => play()}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <PrevButton {...props} />
          <button {...props} onClick={() => {this.props.handlePlaylistSongExtraction(this.state.playlist, 'Next')}}>
          NextButton
          </button>
          <VolumeControl
            {...props} 
          />
          <Timer 
            {...props}
          />
          <Progress
            {...props}
          />
        </div>
      );
    });
    return (
      <CustomPlayer
        resolveUrl={this.props.audioUrl}
        clientId={clientId}
        onReady={() => {
          console.log('player url ready!');
        }}
        onStopTrack={() => {
          console.log('Track has stopped')
        }} />
    );
    }
}

export default SoundPlayer