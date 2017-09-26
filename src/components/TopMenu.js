import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Container, Dropdown, Icon, Button} from 'semantic-ui-react';

import DebuggingContainer from '../containers/DebuggingContainer';

const TopMenu = (props) => {
  return (
    <div>
      <Menu fixed='top'>
        <Container>
          <Menu.Item header>
            <Icon name='book'></Icon>
            Speed Reading
          </Menu.Item>
          <Menu.Item as={Link} to='/'>
            Home
          </Menu.Item>
          <Menu.Item as={Link} to='/textEntry'>
            Text entry
          </Menu.Item>
          <Dropdown text='Exercise' item>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/exercise/reading'>
                Reading test
              </Dropdown.Item>
              <Dropdown.Item as={Link} to='/exercise/wordGroup'>
                Word groups
              </Dropdown.Item>
              <Dropdown.Item as={Link} to='/exercise/disappearing'>
                Disappearing text
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button positive>Login</Button>
            </Menu.Item>
            <Menu.Item>
              <DebuggingContainer />
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
};

export default TopMenu;