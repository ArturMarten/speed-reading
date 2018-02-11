import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu, Container, Dropdown, Icon, Flag, Popup} from 'semantic-ui-react';
import {environment} from '../environment';

import LoginContainer from '../containers/auth/LoginContainer';

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: props.path.split('/').pop(),
      loginModal: false
    };
  }

  itemClickHandler(event, item) {
    this.setState({activeItem: item.name});
  }

  loginClickHandler() {
    this.setState({loginModal: true});
  }

  languageList() {
    return (
      this.props.languages.map((language, index) => {
        if (!language.active) {
          return (
            <Dropdown.Item key={index} onClick={() => this.props.onSettingLanguage(language.code)}>
              <Flag name={language.code}/>
            </Dropdown.Item>
          );
        }
      })
    );
  }
  render() {
    return (
      <Menu compact attached='top' secondary>
        <Container>
          <Menu.Item header>
            <Icon color='blue' name='book' size='big'></Icon>
            {this.props.translate('menu.title')}&nbsp;{environment.version}
          </Menu.Item>
          <Menu.Item name='' active={this.state.activeItem === ''} onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/'>
            {this.props.translate('menu.home')}
          </Menu.Item>
          <Menu.Item name='text-entry' active={this.state.activeItem === 'text-entry'}
            onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/text-entry'>
            {this.props.translate('menu.text-entry')}
          </Menu.Item>
          <Menu.Item name='exercise'
            active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry' && this.state.activeItem !== 'statistics'}>
            <Dropdown text={this.props.translate('menu.exercise')}>
              <Dropdown.Menu>
                <Dropdown.Item
                  name='reading-test'
                  active={this.state.activeItem === 'reading-test'}
                  onClick={(event, item) => this.itemClickHandler(event, item)}
                  as={Link} to='/exercise/reading-test'>
                    {this.props.translate('menu.reading-test')}
                </Dropdown.Item>
                <Dropdown.Item
                  name='word-groups'
                  active={this.state.activeItem === 'word-groups'}
                  onClick={(event, item) => this.itemClickHandler(event, item)}
                  as={Link} to='/exercise/word-groups'>
                    {this.props.translate('menu.word-groups')}
                </Dropdown.Item>
                <Dropdown.Item
                  name='disappearing-text'
                  active={this.state.activeItem === 'disappearing-text'}
                  onClick={(event, item) => this.itemClickHandler(event, item)}
                  as={Link} to='/exercise/disappearing-text'>
                    {this.props.translate('menu.disappearing-text')}
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text={this.props.translate('menu.help-exercises')}>
                    <Dropdown.Menu>
                      <Dropdown.Item disabled>{this.props.translate('menu.schulte-tables')}</Dropdown.Item>
                      <Dropdown.Item disabled>{this.props.translate('menu.concentration')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
          <Menu.Item name='statistics' active={this.state.activeItem === 'statistics'}
            onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/statistics'>
            {this.props.translate('menu.statistics')}
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item fitted>
              <LoginContainer />
            </Menu.Item>
            <Menu.Item fitted>
              <Popup
                trigger={<Icon fitted name='comment' color='grey' size='big' />}
                content={this.props.translate('menu.feedback-popup')}
                on='hover'
              />
            </Menu.Item>
            <Menu.Item fitted>
              <Dropdown icon={<Flag name={this.props.currentLanguage} />}>
                <Dropdown.Menu>
                  {this.languageList()}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            {/*
            <Menu.Item>
              <DebuggingContainer />
            </Menu.Item>
            */}
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

export default TopMenu;
