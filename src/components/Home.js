import React, {Component} from 'react';
import {Container, Header, Divider, Image, Message} from 'semantic-ui-react';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let logos = null;
    if (this.props.currentLanguage === 'ee') {
      logos =
      <Image.Group>
        <Image src={require('../assets/images/ut_est.png')} size='medium' />
        <Image src={require('../assets/images/study_est.jpg')} size='small' />
      </Image.Group>;
    } else {
      logos =
      <Image.Group>
        <Image src={require('../assets/images/ut_eng.png')} size='medium' />
        <Image src={require('../assets/images/study_eng.jpg')} size='small' />
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

export default Home;
