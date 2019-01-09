import React, { Component, Fragment } from 'react';
import { Header, Embed } from 'semantic-ui-react';

import videoPreview from '../../../assets/img/videoPreview.gif';

class IntroVideo extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        <Header as="h3">
          {this.props.translate('intro-video.header')}
        </Header>
        <Embed
          hd
          autoplay
          id="iZRXS6FQwOI"
          brandedUI={false}
          iframe={{
            allowFullScreen: true,
          }}
          placeholder={videoPreview}
          source="youtube"
        />
      </Fragment>
    );
  }
}

export default IntroVideo;
