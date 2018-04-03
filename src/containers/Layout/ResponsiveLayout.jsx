import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { Responsive, Sidebar, Menu, Dropdown, Icon, Grid, Popup, Button, Header } from 'semantic-ui-react';
import { environment } from '../../environment';

import './ResponsiveLayout.css';
import axios from '../../axios-http';
import Auth from '../../containers/Auth/Auth';
import ChangePassword from '../../containers/Auth/ChangePassword';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import Feedback from '../Feedback/Feedback';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

export class ResponsiveLayout extends Component {
  state = {
    sidebarOpened: false,
    profileOpened: false,
    authOpened: false,
    changePasswordOpened: false,
    feedbackOpened: false,
  };

  onLogout = () => {
    this.setState({ profileOpened: false });
  }

  sidebarToggleHandler = () => {
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  }

  profileToggleHandler = () => {
    this.setState({ profileOpened: !this.state.profileOpened });
  }

  authToggleHandler = () => {
    this.setState({ authOpened: !this.state.authOpened, profileOpened: false });
  }

  changePasswordToggleHandler = () => {
    this.setState({ changePasswordOpened: !this.state.changePasswordOpened, profileOpened: false });
  }

  feedbackToggleHandler = () => {
    this.setState({ feedbackOpened: !this.state.feedbackOpened });
  }

  itemClickHandler = () => {
    this.setState({ sidebarOpened: false });
  }

  render() {
    const { children } = this.props;
    return (
      <ErrorBoundary>
        <Sidebar.Pushable>
          {this.state.authOpened || !this.props.isAuthenticated ? <Auth open={this.state.authOpened} /> : null}
          {this.state.changePasswordOpened ?
            <ChangePassword open={this.state.changePasswordOpened} onClose={this.changePasswordToggleHandler} /> : null}
          <Feedback open={this.state.feedbackOpened} onClose={this.feedbackToggleHandler} />
          <Sidebar as={Menu} animation="overlay" vertical visible={this.state.sidebarOpened}>
            <Menu.Menu>
              <Menu.Item>
                {this.props.isAuthenticated ?
                  <Fragment>
                    <Header textAlign="center">{this.props.userEmail}</Header>
                    <Button
                      fluid
                      positive
                      icon
                      labelPosition="right"
                      onClick={this.onLogout}
                      as={Link}
                      to="/logout"
                    >
                      {this.props.translate('auth.logout-button')}
                      <Icon name="sign out" style={{ opacity: 1 }} />
                    </Button>
                  </Fragment> :
                  <Button fluid positive icon labelPosition="right" onClick={this.authToggleHandler}>
                    {this.props.translate('auth.login-button')}
                    <Icon name="sign in" style={{ opacity: 1 }} />
                  </Button>
                }
              </Menu.Item>
            </Menu.Menu>
            <Menu.Item
              active={this.props.path === '/'}
              onClick={this.itemClickHandler}
              as={Link}
              to="/"
            >
              <Icon name="home" size="large" />
              {this.props.translate('menu.home')}
            </Menu.Item>
            <Menu.Item
              active={this.props.path === '/text-entry'}
              onClick={this.itemClickHandler}
              as={Link}
              to="/text-entry"
            >
              <Icon name="file text outline" size="large" />
              {this.props.translate('menu.text-entry')}
            </Menu.Item>
            <Menu.Item
              as="div"
              active={this.props.path.indexOf('/exercise') !== -1}
              className="Dropdown-Item"
            >
              <Icon name="winner" size="large" />
              <Dropdown
                fluid
                text={this.props.translate('menu.exercise')}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={this.props.path === '/exercise/reading-test'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/exercise/reading-test"
                  >
                    {this.props.translate('menu.reading-test')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.props.path === '/exercise/reading-aid'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/exercise/reading-aid"
                  >
                    {this.props.translate('menu.reading-aid')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.props.path === '/exercise/disappearing-text'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/exercise/disappearing-text"
                  >
                    {this.props.translate('menu.disappearing-text')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={this.props.path === '/exercise/word-groups'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/exercise/word-groups"
                  >
                    {this.props.translate('menu.word-groups')}
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown fluid text={this.props.translate('menu.help-exercises')}>
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
              active={this.props.path === '/statistics'}
              onClick={this.itemClickHandler}
              as={Link}
              to="/statistics"
            >
              <Icon name="line graph" size="large" />
              {this.props.translate('menu.statistics')}
            </Menu.Item>
            {this.props.isAuthenticated ?
              <Menu.Item
                active={this.props.path === '/manage'}
                onClick={this.itemClickHandler}
                as={Link}
                to="/manage"
              >
                <Icon name="settings" size="large" />
                {this.props.translate('menu.manage')}
              </Menu.Item> : null}
            <Grid container columns="equal">
              <Grid.Row verticalAlign="middle">
                <Grid.Column textAlign="center">
                  <LanguageSelection />
                </Grid.Column>
                <Grid.Column>
                  <Icon name="talk" color="black" size="big" onClick={this.feedbackToggleHandler} />
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
                  active={this.props.path === '/'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/"
                >
                  <Icon name="home" size="large" />
                  {this.props.translate('menu.home')}
                </Menu.Item>
                <Menu.Item
                  active={this.props.path === '/text-entry'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/text-entry"
                >
                  <Icon name="file text outline" size="large" />
                  {this.props.translate('menu.text-entry')}
                </Menu.Item>
                <Menu.Item
                  as="div"
                  active={this.props.path.indexOf('/exercise') !== -1}
                  onClick={this.dropdownHandler}
                  className="Dropdown-Item"
                >
                  <Icon name="winner" size="large" />
                  <Dropdown
                    fluid
                    text={this.props.translate('menu.exercise')}
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item
                        active={this.props.path === '/exercise/reading-test'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/reading-test"
                      >
                        {this.props.translate('menu.reading-test')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={this.props.path === '/exercise/reading-aid'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/reading-aid"
                      >
                        {this.props.translate('menu.reading-aid')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={this.props.path === '/exercise/disappearing-text'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/disappearing-text"
                      >
                        {this.props.translate('menu.disappearing-text')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        active={this.props.path === '/exercise/word-groups'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/word-groups"
                      >
                        {this.props.translate('menu.word-groups')}
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Dropdown fluid text={this.props.translate('menu.help-exercises')}>
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
                  active={this.props.path === '/statistics'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/statistics"
                >
                  <Icon name="line graph" size="large" />
                  {this.props.translate('menu.statistics')}
                </Menu.Item>
                {this.props.isAuthenticated ?
                  <Menu.Item
                    active={this.props.path === '/manage'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/manage"
                  >
                    <Icon name="settings" size="large" />
                    {this.props.translate('menu.manage')}
                  </Menu.Item> : null}
                <Menu.Menu position="right">
                  <Menu.Item fitted>
                    <Popup
                      on="click"
                      open={this.state.profileOpened}
                      onOpen={this.profileToggleHandler}
                      onClose={this.profileToggleHandler}
                      trigger={<Icon fitted name="user" color="red" size="big" />}
                      position="bottom right"
                      header={this.props.isAuthenticated ? <Header textAlign="center">{this.props.userEmail}</Header> : null}
                      content={
                        this.props.isAuthenticated ?
                          <Button.Group vertical fluid>
                            <Button
                              positive
                              icon
                              labelPosition="right"
                              onClick={this.onLogout}
                              as={Link}
                              to="/logout"
                            >
                              {this.props.translate('auth.logout-button')}
                              <Icon name="sign out" style={{ opacity: 1 }} />
                            </Button>
                            <Button
                              primary
                              icon
                              labelPosition="right"
                              onClick={this.changePasswordToggleHandler}
                              disabled={this.props.userEmail === '***DEMO_EMAIL***'}
                            >
                              {this.props.translate('change-password.change-password-button')}
                              <Icon name="lock" style={{ opacity: 1 }} />
                            </Button>
                          </Button.Group> :
                          <Button positive icon labelPosition="right" onClick={this.authToggleHandler}>
                            {this.props.translate('auth.login-button')}
                            <Icon name="sign in" style={{ opacity: 1 }} />
                          </Button>}
                    />
                  </Menu.Item>
                  <Menu.Item fitted>
                    <Popup
                      trigger={<Icon fitted name="talk" color="black" size="big" onClick={this.feedbackToggleHandler} />}
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
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = state => ({
  path: state.router.location.pathname,
  userEmail: state.profile.email,
  isAuthenticated: state.auth.token !== null,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ResponsiveLayout, axios));
