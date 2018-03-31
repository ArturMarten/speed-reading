import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { Responsive, Sidebar, Menu, Dropdown, Icon, Grid, Popup, Button } from 'semantic-ui-react';
import { environment } from '../../environment';

import './ResponsiveLayout.css';
import * as actionCreators from '../../store/actions';
import axios from '../../axios-http';
import Auth from '../../containers/Auth/Auth';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import Feedback from '../Feedback/Feedback';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

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
      <ErrorBoundary>
        <Sidebar.Pushable>
          {this.state.authOpened ?
            <Auth open={this.state.authOpened} onClose={this.authToggleHandler} /> : null
          }
          <Feedback open={this.state.feedbackOpened} onClose={this.feedbackToggleHandler} />
          <Sidebar as={Menu} animation="overlay" vertical visible={this.state.sidebarOpened}>
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
              as="div"
              name="exercise"
              active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry' &&
                     this.state.activeItem !== 'statistics' && this.state.activeItem !== 'manage'}
              className="Dropdown-Item"
            >
              <Icon name="winner" size="large" />
              <Dropdown
                fluid
                text={this.props.translate('menu.exercise')}
              >
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
                    name="reading-aid"
                    active={this.state.activeItem === 'reading-aid'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/exercise/reading-aid"
                  >
                    {this.props.translate('menu.reading-aid')}
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
                  <Dropdown.Item
                    name="word-groups"
                    active={this.state.activeItem === 'word-groups'}
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
              name="statistics"
              active={this.state.activeItem === 'statistics'}
              onClick={this.itemClickHandler}
              as={Link}
              to="/statistics"
            >
              <Icon name="line graph" size="large" />
              {this.props.translate('menu.statistics')}
            </Menu.Item>
            {this.props.isAuthenticated ?
              <Menu.Item
                name="manage"
                active={this.state.activeItem === 'manage'}
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
                  as="div"
                  name="exercise"
                  active={this.state.activeItem !== '' && this.state.activeItem !== 'text-entry' &&
                        this.state.activeItem !== 'statistics' && this.state.activeItem !== 'manage'}
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
                        name="reading-test"
                        active={this.state.activeItem === 'reading-test'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/reading-test"
                      >
                        {this.props.translate('menu.reading-test')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        name="reading-aid"
                        active={this.state.activeItem === 'reading-aid'}
                        onClick={this.itemClickHandler}
                        as={Link}
                        to="/exercise/reading-aid"
                      >
                        {this.props.translate('menu.reading-aid')}
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
                      <Dropdown.Item
                        name="word-groups"
                        active={this.state.activeItem === 'word-groups'}
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
                  name="statistics"
                  active={this.state.activeItem === 'statistics'}
                  onClick={this.itemClickHandler}
                  as={Link}
                  to="/statistics"
                >
                  <Icon name="line graph" size="large" />
                  {this.props.translate('menu.statistics')}
                </Menu.Item>
                {this.props.isAuthenticated ?
                  <Menu.Item
                    name="manage"
                    active={this.state.activeItem === 'manage'}
                    onClick={this.itemClickHandler}
                    as={Link}
                    to="/manage"
                  >
                    <Icon name="settings" size="large" />
                    {this.props.translate('menu.manage')}
                  </Menu.Item> : null}
                <Menu.Menu position="right">
                  <Menu.Item fitted>
                    {this.props.isAuthenticated ?
                      <Popup
                        trigger={<Icon fitted name="user" color="red" size="big" />}
                        content={
                          <Button positive icon labelPosition="right" onClick={this.onLogout}>
                            {this.props.translate('auth.logout-button')}
                            <Icon name="sign out" style={{ opacity: 1 }} />
                          </Button>}
                        on="click"
                      /> :
                      <Button positive icon labelPosition="right" onClick={this.authToggleHandler}>
                        {this.props.translate('auth.login-button')}
                        <Icon name="sign in" style={{ opacity: 1 }} />
                      </Button>
                    }
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
  isAuthenticated: state.auth.token !== null,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(actionCreators.authLogout());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ResponsiveLayout, axios));
