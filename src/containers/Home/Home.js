import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Header, Divider, Image, Message} from 'semantic-ui-react';
import {getTranslate, getActiveLanguage} from 'react-localize-redux';

export class Home extends Component {
  render() {
    let logos = null;
    if (this.props.currentLanguage === 'ee') {
      logos =
      <Image.Group>
        <Image src={require('../../assets/images/ut_est.png')} size='medium' alt='University of Tartu logo' />
        <Image src={require('../../assets/images/study_est.jpg')} size='small' alt='Study IT logo' />
      </Image.Group>;
    } else {
      logos =
      <Image.Group>
        <Image src={require('../../assets/images/ut_eng.png')} size='medium' alt='University of Tartu logo' />
        <Image src={require('../../assets/images/study_eng.jpg')} size='small' alt='Study IT logo' />
      </Image.Group>;
    }
    return (
      <Container style={{marginTop: '4em'}} textAlign='left'>
        <Header as='h2'>{this.props.translate('home.welcome')}</Header>
        <p>{this.props.translate('home.description')}</p>
        <Message
          warning
          icon='chrome'
          header='Browser compatibility'
          content='Google Chrome is currently supported.'
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
