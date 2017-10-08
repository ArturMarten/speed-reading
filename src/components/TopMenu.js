import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Container, Dropdown, Icon, Button, Flag} from 'semantic-ui-react';

import DebuggingContainer from '../containers/DebuggingContainer';

const TopMenu = (props) => {
  const languageList = props.languages.map((language, index) => {
    if (!language.active) {
      return(
        <Dropdown.Item key={index} onClick={() => props.onSettingLanguage(language.code)}>
          <Flag name={language.code}/>
        </Dropdown.Item>
      )
    }
  });
  return (
    <div>
      <Menu fixed='top'>
        <Container>
          <Menu.Item header>
            <Icon name='book'></Icon>
            {props.translate('menu.title')}
          </Menu.Item>
          <Menu.Item as={Link} to='/'>
            {props.translate('menu.home')}
          </Menu.Item>
          <Menu.Item as={Link} to='/textEntry'>
            {props.translate('menu.text-entry')}
          </Menu.Item>
          <Dropdown text={props.translate('menu.exercise')} item>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/exercise/reading'>
                {props.translate('menu.reading-test')}
              </Dropdown.Item>
              <Dropdown.Item as={Link} to='/exercise/wordGroup'>
                {props.translate('menu.word-groups')}
              </Dropdown.Item>
              <Dropdown.Item as={Link} to='/exercise/disappearing'>
                {props.translate('menu.disappearing-text')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button positive>{props.translate('menu.login')}</Button>
            </Menu.Item>
            <Dropdown icon={<Flag name={props.currentLanguage}/>} item>
              <Dropdown.Menu>
                {languageList}
              </Dropdown.Menu>
            </Dropdown>
            {/*
            <Menu.Item>
              <DebuggingContainer />
            </Menu.Item>
            */}
          </Menu.Menu>
        </Container>
      </Menu>
    </div>
  );
};

export default TopMenu;