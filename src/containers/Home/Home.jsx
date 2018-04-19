import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Divider, Image, Message, Grid, Button } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import About from './About/About';
import IntroVideo from './IntroVideo/IntroVideo';
import AppStats from './AppStats/AppStats';
import utEstLogo from '../../assets/img/ut_est.png';
import utEngLogo from '../../assets/img/ut_eng.png';
import studyEstLogo from '../../assets/img/study_est.jpg';
import studyEngLogo from '../../assets/img/study_eng.jpg';

export class Home extends Component {
  state = {
    aboutOpened: false,
  };

  aboutToggleHandler = () => {
    this.setState({ aboutOpened: !this.state.aboutOpened });
  }

  render() {
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{this.props.translate('home.welcome')}!</Header>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={8}>
              <p>{this.props.translate('home.description')}</p>
              <About open={this.state.aboutOpened} onClose={this.aboutToggleHandler} />
              <Button
                positive
                floated="right"
                content={this.props.translate('home.about')}
                onClick={this.aboutToggleHandler}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <IntroVideo
                language={this.props.currentLanguage}
                translate={this.props.translate}
              />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row columns={3}>
            <Grid.Column>
              <Message
                negative
                icon="bug"
                header={this.props.translate('home.bug-report-title')}
                content={this.props.translate('home.bug-report-content')}
              />
            </Grid.Column>
            <Grid.Column>
              <Message
                warning
                icon="chrome"
                header={this.props.translate('home.browser-warning-title')}
                content={this.props.translate('home.browser-warning-content')}
              />
            </Grid.Column>
            <Grid.Column>
              <Message
                positive
                icon="mobile"
                header={this.props.translate('home.mobile-use-title')}
                content={this.props.translate('home.mobile-use-content')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
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
              MIT {this.props.translate('home.license')} © {(new Date()).getFullYear()} <a href="mailto:martensiiber@gmail.com">Marten Siiber</a>
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
