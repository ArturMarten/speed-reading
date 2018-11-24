import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Divider, Image, Message, Grid, Button, Icon } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import About from './About/About';
import ReleaseNotes from './ReleaseNotes/ReleaseNotes';
import Features from './Features/Features';
import IntroVideo from './IntroVideo/IntroVideo';
import ApplicationStatistics from './ApplicationStatistics/ApplicationStatistics';
import ekkEstLogo from '../../assets/img/ekk_est.png';
import ekkEngLogo from '../../assets/img/ekk_eng.png';
import utEstLogo from '../../assets/img/ut_est.png';
import utEngLogo from '../../assets/img/ut_eng.png';
import studyEstLogo from '../../assets/img/study_est.jpg';
import studyEngLogo from '../../assets/img/study_eng.jpg';
import userManual from '../../assets/doc/kasutusjuhend_est.pdf';

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
        <Header as="h2">
          {`${this.props.translate('home.welcome')}!`}
        </Header>
        <Grid stackable>
          <Grid.Row style={{ paddingBottom: '1em' }}>
            <Grid.Column width={8}>
              <p>
                {this.props.translate('home.description')}
              </p>
              <About open={this.state.aboutOpened} onClose={this.aboutToggleHandler} />
              <Button
                basic
                floated="right"
                icon={<Icon name="info circle" color="blue" />}
                content={this.props.translate('home.about')}
                onClick={this.aboutToggleHandler}
              />
              <Button
                basic
                as="a"
                positive
                floated="right"
                icon="file pdf outline"
                content={this.props.translate('home.user-manual')}
                href={userManual}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Features
                language={this.props.currentLanguage}
                translate={this.props.translate}
              />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row style={{ paddingBottom: '2em' }}>
            <Grid.Column width={8}>
              <ReleaseNotes
                language={this.props.currentLanguage}
                translate={this.props.translate}
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
                positive
                icon="mobile alternate"
                header={this.props.translate('home.mobile-use-title')}
                content={this.props.translate('home.mobile-use-content')}
              />
            </Grid.Column>
            <Grid.Column>
              <Message
                warning
                icon={<Icon name="exclamation triangle" color="yellow" />}
                header={this.props.translate('home.problem-report-title')}
                content={this.props.translate('home.problem-report-content')}
              />
            </Grid.Column>
            <Grid.Column>
              <Message
                negative
                icon={<Icon name="bug" color="olive" />}
                header={this.props.translate('home.bug-report-title')}
                content={this.props.translate('home.bug-report-content')}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ApplicationStatistics />
        <Divider />
        <Grid verticalAlign="middle">
          <Grid.Row columns={3} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <Grid.Column>
              <Image
                centered
                src={this.props.currentLanguage === 'ee' ? ekkEstLogo : ekkEngLogo}
                size="small"
                alt="EEK logo"
              />
            </Grid.Column>
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
              <a href="https://gitlab.com/martensiiber/speed-reading">
                {this.props.translate('home.project')}
              </a>
              {` ${this.props.translate('home.gpl-3-license')} © ${(new Date()).getFullYear()} `}
              <a href="mailto:martensiiber@gmail.com">
                Marten Siiber
              </a>
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
