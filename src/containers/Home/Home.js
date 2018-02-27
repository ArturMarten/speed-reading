import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Header, Divider, Image, Message} from 'semantic-ui-react';
import {getTranslate, getActiveLanguage} from 'react-localize-redux';

import ut_est_logo from '../../assets/images/ut_est.png';
import ut_eng_logo from '../../assets/images/ut_eng.png';
import study_est_logo from '../../assets/images/study_est.jpg';
import study_eng_logo from '../../assets/images/study_eng.jpg';

export class Home extends Component {
  render() {
    let logos = this.props.currentLanguage === 'ee' ?
      <Image.Group>
        <Image src={ut_est_logo} size='medium' alt='University of Tartu logo' />
        <Image src={study_est_logo} size='small' alt='Study IT logo' />
      </Image.Group> :
      <Image.Group>
        <Image src={ut_eng_logo} size='medium' alt='University of Tartu logo' />
        <Image src={study_eng_logo} size='small' alt='Study IT logo' />
      </Image.Group>;
    return (
      <Container style={{marginTop: '4vh'}} textAlign='left'>
        <Header as='h2'>{this.props.translate('home.welcome')}</Header>
        <p>{this.props.translate('home.description')}</p>
        <Message
          warning
          icon='chrome'
          header='Browser compatibility'
          content='Only Google Chrome is currently supported.'
        />
        <Divider />
        {logos}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
