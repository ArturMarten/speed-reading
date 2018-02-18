import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Link} from 'react-router-dom';
import {Responsive, Sidebar, Menu, Dropdown, Icon, Grid} from 'semantic-ui-react';
import {environment} from '../environment';

import LoginContainer from '../containers/Auth/LoginContainer';
import LanguageSelectionContainer from './LanguageSelectionContainer';

class MobileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: false
    };
  }

  sidebarToggleHandler() {
    this.setState({sidebarOpened: !this.state.sidebarOpened});
  }

  itemClickHandler(event, data) {
    this.setState({sidebarOpened: false});
    this.props.onItemClick(event, data);
  }

  render() {
    const {children} = this.props;

    return (
      <Responsive maxWidth={991}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='push' vertical visible={this.state.sidebarOpened}>
            <Menu.Item name='' active={this.props.activeItem === ''} onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/'>
              <Icon name='home' size='large' />
              {this.props.translate('menu.home')}
            </Menu.Item>
            <Menu.Item name='text-entry' active={this.props.activeItem === 'text-entry'}
              onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/text-entry'>
              <Icon name='file text outline' size='large' />
              {this.props.translate('menu.text-entry')}
            </Menu.Item>
            <Menu.Item name='exercise'
              active={this.props.activeItem !== '' && this.props.activeItem !== 'text-entry' && this.props.activeItem !== 'statistics'}>
              <Icon name='winner' size='large' />
              <Dropdown text={this.props.translate('menu.exercise')}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    name='reading-test'
                    active={this.props.activeItem === 'reading-test'}
                    onClick={(event, item) => this.itemClickHandler(event, item)}
                    as={Link} to='/exercise/reading-test'>
                      {this.props.translate('menu.reading-test')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    name='word-groups'
                    active={this.props.activeItem === 'word-groups'}
                    onClick={(event, item) => this.itemClickHandler(event, item)}
                    as={Link} to='/exercise/word-groups'>
                      {this.props.translate('menu.word-groups')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    name='disappearing-text'
                    active={this.props.activeItem === 'disappearing-text'}
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
            <Menu.Item name='statistics' active={this.props.activeItem === 'statistics'}
              onClick={(event, item) => this.itemClickHandler(event, item)} as={Link} to='/statistics'>
              <Icon name='line graph' size='large' />
              {this.props.translate('menu.statistics')}
            </Menu.Item>
            <Grid container columns='equal'>
              <Grid.Row verticalAlign='middle'>
                <Grid.Column textAlign='center'>
                  <LanguageSelectionContainer />
                </Grid.Column>
                <Grid.Column>
                  <Icon name='comment' color='grey' size='big' />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar>

          <Sidebar.Pusher dimmed={this.state.sidebarOpened} style={{minHeight: '100vh'}}>
            <Menu compact attached='top' secondary>
              <Menu.Item onClick={() => this.sidebarToggleHandler()}>
                <Icon name='sidebar' size='large' />
              </Menu.Item>
              <Menu.Item header>
                <Icon color='blue' name='book' size='big'></Icon>
                {this.props.translate('menu.title')}&nbsp;{environment.version}
              </Menu.Item>
              <Menu.Menu position='right'>
                <Menu.Item>
                  <LoginContainer />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps, null)(MobileContainer);
