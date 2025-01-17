/* eslint-disable jsx-a11y/media-has-caption */

import * as React from 'react';
import Hls from 'hls.js';
import './player.css';

interface PlayerProps {
  playbackUrl: string;
  posterUrl: string;
  ratio: string;
  audioOnly: boolean;
  onReady: () => void;
}

class Player extends React.Component<PlayerProps, {}> {
  playerRef: React.RefObject<HTMLVideoElement>;
  hls: Hls;

  static defaultProps = {
    ratio: '16:9',
    onReady: () => {},
  };

  constructor(props: PlayerProps) {
    super(props);

    this.playerRef = React.createRef();
    this.hls = new Hls();
    this.hls.on(Hls.Events.MEDIA_ATTACHED, () => this.onReady());
  }

  onReady = () => {
    this.props.onReady();
  };

  componentDidMount() {
    if (!this.playerRef.current) {
      throw new Error('No reference to an existing video element found.');
    }

    if (Hls.isSupported()) {
      this.hls.loadSource(this.props.playbackUrl);
      this.hls.attachMedia(this.playerRef.current);
    } else if (this.playerRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      this.playerRef.current.src = this.props.playbackUrl;
    }
  }

  convertRatio = () => {
    const [width, height] = this.props.ratio.split(':').map((n) => parseFloat(n));
    return height / width;
  };

  getHeight = () => {
    if (!this.playerRef.current || this.props.audioOnly) return;
    return this.playerRef.current.offsetWidth * this.convertRatio();
  };

  render() {
    return (
      <div className="player">
        <video
          ref={this.playerRef}
          poster={this.props.posterUrl}
          controls
          width="100%"
          height={this.getHeight() + 'px'}
        />
      </div>
    );
  }
}

export default Player;
