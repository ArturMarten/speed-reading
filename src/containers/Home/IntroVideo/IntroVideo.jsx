import React, { Component, Fragment } from 'react';
import { Header, Embed } from 'semantic-ui-react';

class IntroVideo extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <Fragment>
        <Header as="h3">{this.props.translate('home.introduction-video')}</Header>
        <Embed
          id="99jLM5ICbVQ"
          hd
          aspectRatio="16:9"
          source="youtube"
        />
      </Fragment>
    );
  }
}

export default IntroVideo;
