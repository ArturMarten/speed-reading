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
import AchievementUpdates from '../Achievements/AchievementUpdates';
// import userManual from '../../assets/doc/kasutusjuhend_est.pdf';

export class Home extends Component {
  state = {
    aboutOpened: false,
  };

  aboutToggleHandler = () => {
    this.setState({ aboutOpened: !this.state.aboutOpened });
  };

  render() {
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{`${this.props.translate('home.title')}`}</Header>
        <Grid stackable>
          <Grid.Row style={{ paddingBottom: '1em' }}>
            <Grid.Column width={8}>
              <p>{this.props.translate('home.description')}</p>
              <p>{this.props.translate('home.course-description')}</p>
              <p>
                {this.props.translate('home.rewards')}
                &nbsp;
                <a href="https://www.etag.ee/tegevused/konkursid/kasvatusteaduslike-toode-konkurss/varasemad-konkursid/">
                  {this.props.translate('home.rewards-more-information')}
                </a>
              </p>
              <About open={this.state.aboutOpened} onClose={this.aboutToggleHandler} translate={this.props.translate} />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button
                  basic
                  icon={<Icon name="info circle" color="blue" />}
                  content={this.props.translate('home.about')}
                  onClick={this.aboutToggleHandler}
                />
                <Button
                  basic
                  as="a"
                  positive
                  icon="file pdf outline"
                  content={this.props.translate('home.user-manual')}
                  href="https://kiirlugemine.keeleressursid.ee/api/kasutusjuhend_est.pdf"
                />
              </div>
              <div
                style={{ marginTop: '1em', width: '100%', maxHeight: '265px', overflow: 'auto', paddingRight: '10px' }}
              >
                <AchievementUpdates />
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <Features translate={this.props.translate} />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row style={{ paddingBottom: '2em' }}>
            <Grid.Column width={8}>
              <ReleaseNotes translate={this.props.translate} />
            </Grid.Column>
            <Grid.Column width={8}>
              <IntroVideo translate={this.props.translate} />
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
        <ApplicationStatistics translate={this.props.translate} />
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
            <Grid.Column textAlign="center">{this.props.translate('home.supported')}</Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column textAlign="right">
              <a href="https://gitlab.com/martensiiber/speed-reading">{this.props.translate('home.project')}</a>
              {` ${this.props.translate('home.gpl-3-license')} © ${new Date().getFullYear()} `}
              <a href="mailto:martensiiber@gmail.com">Marten Siiber</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
