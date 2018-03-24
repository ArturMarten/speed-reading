import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Divider, Image, Message, Grid } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import AppStats from './AppStats/AppStats';
import utEstLogo from '../../assets/img/ut_est.png';
import utEngLogo from '../../assets/img/ut_eng.png';
import studyEstLogo from '../../assets/img/study_est.jpg';
import studyEngLogo from '../../assets/img/study_eng.jpg';

export class Home extends Component {
  state = {};

  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('home.welcome')}!</Header>
        <p>{this.props.translate('home.description')}</p>
        <Message
          warning
          icon="chrome"
          header={this.props.translate('home.browser-warning-title')}
          content={this.props.translate('home.browser-warning-content')}
        />
        <AppStats />
        <Divider />
        <Grid verticalAlign="middle">
          <Grid.Row columns={2} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Grid.Column>
              <Image
                centered
                src={this.props.currentLanguage === 'ee' ? utEstLogo : utEngLogo}
                size="medium"
                alt="University of Tartu logo"
              />
            </Grid.Column>
            <Grid.Column>
              <Image
                centered
                src={this.props.currentLanguage === 'ee' ? studyEstLogo : studyEngLogo}
                size="small"
                alt="Study IT logo"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column textAlign="right">
              MIT license © {(new Date()).getFullYear()} <a href="mailto:martensiiber@gmail.com">Marten Siiber</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
