import React from 'react';
import {Container, Header} from 'semantic-ui-react';

const Home = (props) => {
  return (
    <div>
      <Container text>
        <Header as='h2'>Welcome</Header>
        <p>To get started, choose an exercise from the menu above!</p>
      </Container>
    </div>
  );
};

export default Home;
