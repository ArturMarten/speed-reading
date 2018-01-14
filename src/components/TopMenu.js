import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Menu, Container, Dropdown, Icon, Button, Flag, Popup} from 'semantic-ui-react';

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: props.path.split('/').pop()
    };
  }

  itemClickHandler(event, item) {
    this.setState({activeItem: item.name});
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
      <div>
        <Menu compact attached='top' secondary>
          <Container>
            <Menu.Item header>
              <Icon color='blue' name='book' size='big'></Icon>
              {this.props.translate('menu.title')}
            </Menu.Item>
            <Menu.Item name='' active={this.state.activeItem === ''} onClick={this.itemClickHandler.bind(this)} as={Link} to='/'>
              {this.props.translate('menu.home')}
            </Menu.Item>
            <Menu.Item name='text-entry' active={this.state.activeItem === 'text-entry'}
              onClick={this.itemClickHandler.bind(this)} as={Link} to='/text-entry'>
              {this.props.translate('menu.text-entry')}
            </Menu.Item>
            <Menu.Item name='exercise' active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry'}>
              <Dropdown text={this.props.translate('menu.exercise')}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    name='reading-test'
                    active={this.state.activeItem === 'reading-test'}
                    onClick={this.itemClickHandler.bind(this)}
                    as={Link} to='/exercise/reading-test'>
                      {this.props.translate('menu.reading-test')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    name='reading-with-style-test'
                    active={this.state.activeItem === 'reading-with-style-test'}
                    onClick={this.itemClickHandler.bind(this)}
                    as={Link} to='/exercise/reading-with-style-test'>
                      {this.props.translate('menu.reading-with-style-test')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    name='word-groups'
                    active={this.state.activeItem === 'word-groups'}
                    onClick={this.itemClickHandler.bind(this)}
                    as={Link} to='/exercise/word-groups'>
                      {this.props.translate('menu.word-groups')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    name='disappearing-text'
                    active={this.state.activeItem === 'disappearing-text'}
                    onClick={this.itemClickHandler.bind(this)}
                    as={Link} to='/exercise/disappearing-text'>
                      {this.props.translate('menu.disappearing-text')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item fitted>
                <Button positive icon labelPosition='right'>
                  {this.props.translate('menu.login')}
                  <Icon name='sign in' style={{opacity: 1}}></Icon>
                </Button>
              </Menu.Item>
              <Menu.Item fitted>
                <Popup
                  trigger={<Icon fitted name='comment' color='grey' size='big' />}
                  content='Give feedback or report a bug'
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
      </div>
    );
  }
}

export default TopMenu;
