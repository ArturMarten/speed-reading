import React from 'react';
import {Container, Header, Divider, Image} from 'semantic-ui-react';

const Home = (props) => {
  return (
    <div>
      <Container style={{marginTop: '4em'}} textAlign='left'>
        <Header as='h2'>Welcome</Header>
        <p>To get started, choose an exercise from the menu above!</p>
        <Divider />
        <Image.Group>
          <Image src={require('../assets/images/ut_eng.png')} size='medium' />
          <Image src={require('../assets/images/study_eng.jpg')} size='small' />
        </Image.Group>
      </Container>
    </div>
  );
};

export default Home;
