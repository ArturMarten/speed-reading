import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Divider, Image, Message } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import utEstLogo from '../../assets/img/ut_est.png';
import utEngLogo from '../../assets/img/ut_eng.png';
import studyEstLogo from '../../assets/img/study_est.jpg';
import studyEngLogo from '../../assets/img/study_eng.jpg';

export class Home extends Component {
  state = {};
  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('home.welcome')}</Header>
        <p>{this.props.translate('home.description')}</p>
        <Message
          warning
          icon="chrome"
          header="Browser compatibility"
          content="Only Google Chrome is currently supported."
        />
        <Divider />
        {this.props.currentLanguage === 'ee' ?
          <Image.Group>
            <Image src={utEstLogo} size="medium" alt="University of Tartu logo" />
            <Image src={studyEstLogo} size="small" alt="Study IT logo" />
          </Image.Group> :
          <Image.Group>
            <Image src={utEngLogo} size="medium" alt="University of Tartu logo" />
            <Image src={studyEngLogo} size="small" alt="Study IT logo" />
          </Image.Group>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
