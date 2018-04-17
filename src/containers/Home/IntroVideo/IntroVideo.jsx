import React, { Component, Fragment } from 'react';
import {
  Header,
//   Label,
} from 'semantic-ui-react';

const RESIZE_DELAY = 100;

class IntroVideo extends Component {
  state = {
    // eslint-disable-next-line
    src: '//youtube.com/embed/99jLM5ICbVQ?cc_load_policy=1&hl=et',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.forceUpdate(), RESIZE_DELAY);
  }

  timestampHandler = timestamp => () => {
    this.setState({
      // eslint-disable-next-line
      src: `//youtube.com/embed/99jLM5ICbVQ?start=${timestamp}&cc_load_policy=1&hl=${this.props.language === 'ee' ? 'et' : 'en'}&autoplay=1&time=${Date.now()}`,
    });
  }

  render() {
    // const videoHeight = this.videoRef ? `${this.videoRef.offsetWidth * 0.5625}px` : '200px';
    return (
      <Fragment>
        <Header as="h3">
          {this.props.translate('intro-video.header')}
        </Header>
        {this.props.translate('intro-video.being-made')}
        {/*
        <Label.Group size="large">
          <Label as="a" color="green" onClick={this.timestampHandler(2)}>
            {this.props.translate('intro-video.authentication')} (0:02)
          </Label>
          <Label as="a" color="teal" onClick={this.timestampHandler(12)}>
            {this.props.translate('intro-video.add-user')} (0:12)
          </Label>
        </Label.Group>
        <iframe
          title={this.props.translate('intro-video.title')}
          width="100%"
          height={videoHeight}
          src={this.state.src}
          frameBorder="0"
          allowFullScreen
          ref={(ref) => { this.videoRef = ref; }}
        >
          {this.props.translate('intro-video.no-iframe')}
        </iframe>
        */}
      </Fragment>
    );
  }
}

export default IntroVideo;
