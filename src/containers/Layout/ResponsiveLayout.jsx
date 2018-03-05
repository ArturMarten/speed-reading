import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { Responsive, Sidebar, Menu, Dropdown, Icon, Grid, Popup, Button } from 'semantic-ui-react';
import { environment } from '../../environment';

import * as actionCreators from '../../store/actions';
import Auth from '../../containers/Auth/Auth';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import Feedback from '../Feedback/Feedback';

export class ResponsiveLayout extends Component {
  state = {
    activeItem: this.props.path.split('/').pop(),
    sidebarOpened: false,
    authOpened: false,
    feedbackOpened: false,
  };

  onLogout = () => {
    this.props.onLogout();
  }

  sidebarToggleHandler = () => {
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  }

  authToggleHandler = () => {
    this.setState({ authOpened: !this.state.authOpened });
  }

  feedbackToggleHandler = () => {
    this.setState({ feedbackOpened: !this.state.feedbackOpened });
  }

  itemClickHandler = (event, { name }) => {
    this.setState({
      sidebarOpened: false,
      activeItem: name,
    });
  }

  render() {
    const { children } = this.props;

    return (
      <Sidebar.Pushable>
        <Auth open={this.state.authOpened} onClose={this.authToggleHandler} />
        <Feedback open={this.state.feedbackOpened} onClose={this.feedbackToggleHandler} />
        <Sidebar as={Menu} animation="push" vertical visible={this.state.sidebarOpened}>
          <Menu.Menu>
            <Menu.Item>
              {this.props.isAuthenticated ?
                <Button fluid positive icon labelPosition="right" onClick={this.onLogout}>
                  {this.props.translate('auth.logout-button')}
                  <Icon name="sign out" style={{ opacity: 1 }} />
                </Button> :
                <Button fluid positive icon labelPosition="right" onClick={this.authToggleHandler}>
                  {this.props.translate('auth.login-button')}
                  <Icon name="sign in" style={{ opacity: 1 }} />
                </Button>
              }
            </Menu.Item>
          </Menu.Menu>
          <Menu.Item
            name=""
            active={this.state.activeItem === ''}
            onClick={this.itemClickHandler}
            as={Link}
            to="/"
          >
            <Icon name="home" size="large" />
            {this.props.translate('menu.home')}
          </Menu.Item>
          <Menu.Item
            name="text-entry"
            active={this.state.activeItem === 'text-entry'}
            onClick={this.itemClickHandler}
            as={Link}
            to="/text-entry"
          >
            <Icon name="file text outline" size="large" />
            {this.props.translate('menu.text-entry')}
          </Menu.Item>
          <Menu.Item
            name="exercise"
            active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry' && this.state.activeItem !== 'statistics'}
          >
            <Icon name="winner" size="large" />
            <Dropdown text={this.props.translate('menu.exercise')}>
              <Dropdown.Menu>
                <Dropdown.Item
                  name="reading-test"
                  active={this.state.activeItem === 'reading-test'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/exercise/reading-test"
                >
                  {this.props.translate('menu.reading-test')}
                </Dropdown.Item>
                <Dropdown.Item
                  name="word-groups"
                  active={this.state.activeItem === 'word-groups'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/exercise/word-groups"
                >
                  {this.props.translate('menu.word-groups')}
                </Dropdown.Item>
                <Dropdown.Item
                  name="disappearing-text"
                  active={this.state.activeItem === 'disappearing-text'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/exercise/disappearing-text"
                >
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
          <Menu.Item
            name="statistics"
            active={this.state.activeItem === 'statistics'}
            onClick={this.itemClickHandler}
            as={Link}
            to="/statistics"
          >
            <Icon name="line graph" size="large" />
            {this.props.translate('menu.statistics')}
          </Menu.Item>
          <Grid container columns="equal">
            <Grid.Row verticalAlign="middle">
              <Grid.Column textAlign="center">
                <LanguageSelection />
              </Grid.Column>
              <Grid.Column>
                <Icon name="talk" color="grey" size="big" onClick={this.feedbackToggleHandler} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Sidebar>

        <Sidebar.Pusher
          dimmed={this.state.sidebarOpened}
          onClick={this.state.sidebarOpened ? this.sidebarToggleHandler : undefined}
          style={{ minHeight: '100vh' }}
        >
          <Responsive maxWidth={991}>
            <Menu compact attached="top" secondary>
              <Menu.Item onClick={this.sidebarToggleHandler}>
                <Icon name="sidebar" size="large" />
              </Menu.Item>
              <Menu.Item header>
                <Icon color="blue" name="book" size="big" />
                {this.props.translate('menu.title')}&nbsp;{environment.version}
              </Menu.Item>
            </Menu>
          </Responsive>
          <Responsive minWidth={992}>
            <Menu compact attached="top" secondary>
              <Menu.Item header>
                <Icon color="blue" name="book" size="big" />
                {this.props.translate('menu.title')}&nbsp;{environment.version}
              </Menu.Item>
              <Menu.Item
                name=""
                active={this.state.activeItem === ''}
                onClick={this.itemClickHandler}
                as={Link}
                to="/"
              >
                <Icon name="home" size="large" />
                {this.props.translate('menu.home')}
              </Menu.Item>
              <Menu.Item
                name="text-entry"
                active={this.state.activeItem === 'text-entry'}
                onClick={this.itemClickHandler}
                as={Link}
                to="/text-entry"
              >
                <Icon name="file text outline" size="large" />
                {this.props.translate('menu.text-entry')}
              </Menu.Item>
              <Menu.Item
                name="exercise"
                active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry' && this.state.activeItem !== 'statistics'}
              >
                <Icon name="winner" size="large" />
                <Dropdown text={this.props.translate('menu.exercise')}>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      name="reading-test"
                      active={this.state.activeItem === 'reading-test'}
                      onClick={this.itemClickHandler}
                      as={Link}
                      to="/exercise/reading-test"
                    >
                      {this.props.translate('menu.reading-test')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      name="word-groups"
                      active={this.state.activeItem === 'word-groups'}
                      onClick={this.itemClickHandler}
                      as={Link}
                      to="/exercise/word-groups"
                    >
                      {this.props.translate('menu.word-groups')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      name="disappearing-text"
                      active={this.state.activeItem === 'disappearing-text'}
                      onClick={this.itemClickHandler}
                      as={Link}
                      to="/exercise/disappearing-text"
                    >
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
              <Menu.Item
                name="statistics"
                active={this.state.activeItem === 'statistics'}
                onClick={this.itemClickHandler}
                as={Link}
                to="/statistics"
              >
                <Icon name="line graph" size="large" />
                {this.props.translate('menu.statistics')}
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item fitted>
                  {this.props.isAuthenticated ?
                    <Button positive icon labelPosition="right" onClick={this.onLogout}>
                      {this.props.translate('auth.logout-button')}
                      <Icon name="sign out" style={{ opacity: 1 }} />
                    </Button> :
                    <Button positive icon labelPosition="right" onClick={this.authToggleHandler}>
                      {this.props.translate('auth.login-button')}
                      <Icon name="sign in" style={{ opacity: 1 }} />
                    </Button>
                  }
                </Menu.Item>
                <Menu.Item fitted>
                  <Popup
                    trigger={<Icon fitted name="talk" color="grey" size="big" onClick={this.feedbackToggleHandler} />}
                    content={this.props.translate('menu.feedback-popup')}
                    on="hover"
                  />
                </Menu.Item>
                <Menu.Item fitted>
                  <LanguageSelection />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Responsive>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

const mapStateToProps = state => ({
  path: state.router.location.pathname,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(actionCreators.authLogout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveLayout);
