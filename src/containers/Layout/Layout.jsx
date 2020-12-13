import React, { Component, Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { push } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, Dropdown, Icon, Grid, Popup, Button, Header, Loader } from 'semantic-ui-react';
import { environment } from '../../environment';

import axios from '../../api/axios-http';
import credentials from '../../credentials';
import Auth from '../Auth/Auth';
import ProfileSettings from '../Profile/ProfileSettings';
import ChangePassword from '../Auth/ChangePassword';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import Feedback from '../Feedback/Feedback';
import withErrorHandler from '../../hoc/ErrorHandler/withErrorHandler';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { rolePermissions } from '../../store/reducers/profile';
import MediaQuery from 'react-responsive';

const ProblemReport = lazy(() => import('../ProblemReport/ProblemReport'));
const BugReport = lazy(() => import('../BugReport/BugReport'));

export class Layout extends Component {
  state = {
    sidebarOpened: false,
    profileOpened: false,
    authOpened: false,
    profileSettingsOpened: false,
    changePasswordOpened: false,
    feedbackOpened: false,
    problemReportOpened: false,
    bugReportOpened: false,
    redirectPath: '',
  };

  componentDidUpdate(prevProps) {
    if (prevProps.role === '' && this.props.role !== '' && this.props.firstName === '' && this.props.lastName === '') {
      this.profileSettingsToggleHandler();
    }
    if (!prevProps.profileFetched && this.props.profileFetched) {
      this.redirect();
    }
  }

  onLogout = () => {
    this.setState({ profileOpened: false });
  };

  sidebarToggleHandler = () => {
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  };

  profileToggleHandler = () => {
    this.setState({ profileOpened: !this.state.profileOpened });
  };

  profileSettingsToggleHandler = () => {
    this.setState({ profileSettingsOpened: !this.state.profileSettingsOpened, profileOpened: false });
  };

  authToggleHandler = () => {
    this.setState({ authOpened: !this.state.authOpened, profileOpened: false });
  };

  authCloseHandler = () => {
    this.setState({ authOpened: false, redirectPath: '' });
  };

  changePasswordToggleHandler = () => {
    this.setState({ changePasswordOpened: !this.state.changePasswordOpened, profileOpened: false });
  };

  feedbackToggleHandler = () => {
    this.setState({ feedbackOpened: !this.state.feedbackOpened });
  };

  problemReportToggleHandler = () => {
    this.setState({ problemReportOpened: !this.state.problemReportOpened });
  };

  bugReportToggleHandler = () => {
    this.setState({ bugReportOpened: !this.state.bugReportOpened });
  };

  itemClickHandler = (event, path) => {
    const { isAuthenticated } = this.props;
    const isHomePage = path === '/';
    if (isAuthenticated || isHomePage) {
      this.props.redirect(path);
    }
    this.setState({
      sidebarOpened: false,
      profileOpened: false,
      authOpened: !isAuthenticated && !isHomePage,
      redirectPath: isAuthenticated || isHomePage ? '' : path,
    });
  };

  redirect = () => {
    if (this.state.redirectPath !== '') {
      this.props.redirect(this.state.redirectPath);
    }
    this.setState({ authOpened: false, redirectPath: '' });
  };

  render() {
    const { role, children, path } = this.props;
    const isPermittedToModifyTexts = rolePermissions[role] >= rolePermissions.editor;
    const isPermittedToManageUsers = rolePermissions[role] >= rolePermissions.teacher;
    const isHomePage = path === '/' && true;
    return (
      <ErrorBoundary>
        <Suspense fallback={<Loader active size="massive" indeterminate />}>
          <Sidebar.Pushable>
            {(this.state.authOpened && !this.props.isAuthenticated) || (!this.props.isAuthenticated && !isHomePage) ? (
              <Auth open={this.state.authOpened} onClose={this.authCloseHandler} closeIcon={this.state.authOpened} />
            ) : null}
            {this.state.profileSettingsOpened ? (
              <ProfileSettings open={this.state.profileSettingsOpened} onClose={this.profileSettingsToggleHandler} />
            ) : null}
            {this.state.changePasswordOpened ? (
              <ChangePassword open={this.state.changePasswordOpened} onClose={this.changePasswordToggleHandler} />
            ) : null}
            {this.state.feedbackOpened ? (
              <Feedback open={this.state.feedbackOpened} onClose={this.feedbackToggleHandler} />
            ) : null}
            {this.state.problemReportOpened ? (
              <ProblemReport open={this.state.problemReportOpened} onClose={this.problemReportToggleHandler} />
            ) : null}
            {this.state.bugReportOpened ? (
              <BugReport open={this.state.bugReportOpened} onClose={this.bugReportToggleHandler} />
            ) : null}
            <Sidebar as={Menu} animation="overlay" vertical visible={this.state.sidebarOpened}>
              <Menu.Menu>
                <Menu.Item>
                  {this.props.isAuthenticated ? (
                    <>
                      <Header textAlign="center">{this.props.userEmail}</Header>
                      <Grid>
                        <Grid.Row columns={3} textAlign="center">
                          <Grid.Column>
                            <Button
                              circular
                              primary
                              size="large"
                              icon="lock"
                              onClick={this.changePasswordToggleHandler}
                              disabled={this.props.userEmail === credentials.demo.username}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Button
                              circular
                              as={Link}
                              positive
                              size="large"
                              icon="sign out"
                              onClick={this.onLogout}
                              to="/logout"
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Button
                              circular
                              color="black"
                              size="large"
                              icon="setting"
                              onClick={this.profileSettingsToggleHandler}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </>
                  ) : (
                    <Button fluid positive icon labelPosition="right" onClick={this.authToggleHandler}>
                      {this.props.translate('auth.login-button')}
                      <Icon name="sign in" style={{ opacity: 1 }} />
                    </Button>
                  )}
                </Menu.Item>
              </Menu.Menu>
              <Menu.Item as="a" active={path === '/'} onClick={(event) => this.itemClickHandler(event, '/')}>
                <Icon name="home" size="large" />
                {this.props.translate('menu.home')}
              </Menu.Item>
              {isPermittedToModifyTexts ? (
                <Menu.Item
                  as="a"
                  active={path === '/text-entry'}
                  onClick={(event) => this.itemClickHandler(event, '/text-entry')}
                >
                  <Icon name="file alternate outline" color="blue" size="large" />
                  {this.props.translate('menu.text-entry')}
                </Menu.Item>
              ) : null}
              <Dropdown
                as="div"
                className={`item ${path.indexOf('/exercise') !== -1 ? 'active' : ''}`}
                openOnFocus
                icon={
                  <>
                    {this.props.translate('menu.exercise')}
                    <Icon name="university" color="black" size="large" />
                    <Icon name="caret down" />
                  </>
                }
              >
                <Dropdown.Menu style={{ left: '0px', top: '100%', minWidth: 'calc(100% - 1px)' }}>
                  <Dropdown.Header
                    style={{ color: 'rgba(0, 76, 255, 0.85)' }}
                    content={this.props.translate('menu.reading-exercises')}
                  />
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/reading-test'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/reading-test')}
                  >
                    {this.props.translate('menu.reading-test')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/reading-aid'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/reading-aid')}
                  >
                    {this.props.translate('menu.reading-aid')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/scrolling-text'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/scrolling-text')}
                  >
                    {this.props.translate('menu.scrolling-text')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/disappearing-text'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/disappearing-text')}
                  >
                    {this.props.translate('menu.disappearing-text')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/word-groups'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/word-groups')}
                  >
                    {this.props.translate('menu.word-groups')}
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ margin: 0 }} />
                  <Dropdown.Header
                    style={{ color: 'rgba(0, 76, 255, 0.85)' }}
                    content={this.props.translate('menu.help-exercises')}
                  />
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/schulte-tables'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/schulte-tables')}
                  >
                    {this.props.translate('menu.schulte-tables')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="a"
                    active={path === '/exercise/concentration'}
                    onClick={(event) => this.itemClickHandler(event, '/exercise/concentration')}
                  >
                    {this.props.translate('menu.concentration')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item
                as="a"
                active={path === '/achievements'}
                onClick={(event) => this.itemClickHandler(event, '/achievements')}
              >
                <Icon name="winner" color="yellow" size="large" />
                {this.props.translate('menu.achievements')}
              </Menu.Item>
              <Menu.Item
                as="a"
                active={path === '/statistics'}
                onClick={(event) => this.itemClickHandler(event, '/statistics')}
              >
                <Icon name="line graph" color="red" size="large" />
                {this.props.translate('menu.statistics')}
              </Menu.Item>
              {isPermittedToManageUsers ? (
                <Menu.Item
                  as="a"
                  active={path === '/manage'}
                  onClick={(event) => this.itemClickHandler(event, '/manage')}
                >
                  <Icon name="settings" size="large" />
                  {this.props.translate('menu.manage')}
                </Menu.Item>
              ) : null}
              <Grid container columns="equal">
                <Grid.Row verticalAlign="middle">
                  <Grid.Column textAlign="center">
                    <LanguageSelection />
                  </Grid.Column>
                  <Grid.Column>
                    <Icon name="talk" color="black" size="big" onClick={this.feedbackToggleHandler} />
                  </Grid.Column>
                  <Grid.Column>
                    <Icon
                      name="exclamation triangle"
                      color="yellow"
                      size="big"
                      onClick={this.problemReportToggleHandler}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Icon name="bug" color="olive" size="big" onClick={this.bugReportToggleHandler} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Sidebar>
            <Sidebar.Pusher
              dimmed={this.state.sidebarOpened}
              onClick={this.state.sidebarOpened ? this.sidebarToggleHandler : undefined}
              style={{ minHeight: '100vh' }}
            >
              <MediaQuery maxWidth={991}>
                <Menu compact attached="top" secondary>
                  <Menu.Item onClick={this.sidebarToggleHandler}>
                    <Icon name="sidebar" size="large" />
                  </Menu.Item>
                  <Menu.Item
                    as="a"
                    header
                    onClick={(event) => this.itemClickHandler(event, '/')}
                    style={{ whiteSpace: 'pre' }}
                  >
                    <Icon color="blue" name="book" size="big" />
                    {`${this.props.translate('menu.title')} ${environment.version}`}
                  </Menu.Item>
                </Menu>
              </MediaQuery>
              <MediaQuery minWidth={992}>
                <Menu compact attached="top" secondary>
                  <Menu.Item as="a" header onClick={(event) => this.itemClickHandler(event, '/')}>
                    <Icon color="blue" name="book" size="big" />
                    {`${this.props.translate('menu.title')} ${environment.version}`}
                  </Menu.Item>
                  <Menu.Item as="a" active={path === '/'} onClick={(event) => this.itemClickHandler(event, '/')}>
                    <Icon name="home" size="large" />
                    {this.props.translate('menu.home')}
                  </Menu.Item>
                  {isPermittedToModifyTexts ? (
                    <Menu.Item
                      as="a"
                      active={path === '/text-entry'}
                      onClick={(event) => this.itemClickHandler(event, '/text-entry')}
                    >
                      <Icon name="file alternate outline" color="blue" size="large" />
                      {this.props.translate('menu.text-entry')}
                    </Menu.Item>
                  ) : null}
                  <Dropdown
                    as="div"
                    className={`link item ${path.indexOf('/exercise') !== -1 ? 'active' : ''}`}
                    icon={
                      <>
                        <Icon name="university" color="black" size="large" />
                        {this.props.translate('menu.exercise')}
                        <i className="dropdown icon" />
                      </>
                    }
                  >
                    <Dropdown.Menu style={{ marginTop: '0em' }}>
                      <Dropdown.Header
                        style={{ color: 'rgba(0, 76, 255, 0.85)' }}
                        content={this.props.translate('menu.reading-exercises')}
                      />
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/reading-test'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/reading-test')}
                      >
                        {this.props.translate('menu.reading-test')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/reading-aid'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/reading-aid')}
                      >
                        {this.props.translate('menu.reading-aid')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/scrolling-text'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/scrolling-text')}
                      >
                        {this.props.translate('menu.scrolling-text')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/disappearing-text'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/disappearing-text')}
                      >
                        {this.props.translate('menu.disappearing-text')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/word-groups'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/word-groups')}
                      >
                        {this.props.translate('menu.word-groups')}
                      </Dropdown.Item>
                      <Dropdown.Divider style={{ margin: 0 }} />
                      <Dropdown.Header
                        style={{ color: 'rgba(0, 76, 255, 0.85)' }}
                        content={this.props.translate('menu.help-exercises')}
                      />
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/schulte-tables'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/schulte-tables')}
                      >
                        {this.props.translate('menu.schulte-tables')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        as="a"
                        active={path === '/exercise/concentration'}
                        onClick={(event) => this.itemClickHandler(event, '/exercise/concentration')}
                      >
                        {this.props.translate('menu.concentration')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Menu.Item
                    as="a"
                    active={path === '/achievements'}
                    onClick={(event) => this.itemClickHandler(event, '/achievements')}
                  >
                    <Icon name="winner" color="yellow" size="large" />
                    {this.props.translate('menu.achievements')}
                  </Menu.Item>
                  <Menu.Item
                    as="a"
                    active={path === '/statistics'}
                    onClick={(event) => this.itemClickHandler(event, '/statistics')}
                  >
                    <Icon name="line graph" color="red" size="large" />
                    {this.props.translate('menu.statistics')}
                  </Menu.Item>
                  {isPermittedToManageUsers ? (
                    <Menu.Item
                      as="a"
                      active={path === '/manage'}
                      onClick={(event) => this.itemClickHandler(event, '/manage')}
                    >
                      <Icon name="settings" size="large" />
                      {this.props.translate('menu.manage')}
                    </Menu.Item>
                  ) : null}
                  <Menu.Menu position="right">
                    {this.props.isAuthenticated ? (
                      <Menu.Item fitted>
                        <Popup
                          on="click"
                          open={this.state.profileOpened}
                          onOpen={this.profileToggleHandler}
                          onClose={this.profileToggleHandler}
                          trigger={<Icon fitted name="user" color="red" size="large" />}
                          position="bottom right"
                          header={<Header textAlign="center">{this.props.userEmail}</Header>}
                          content={
                            <Button.Group vertical fluid>
                              <Button
                                color="black"
                                icon
                                labelPosition="right"
                                onClick={this.profileSettingsToggleHandler}
                                disabled={this.props.userEmail === credentials.demo.username}
                              >
                                {this.props.translate('profile.user-settings')}
                                <Icon name="setting" style={{ opacity: 1 }} />
                              </Button>
                              <Button
                                as={Link}
                                positive
                                icon
                                labelPosition="right"
                                onClick={this.onLogout}
                                to="/logout"
                              >
                                {this.props.translate('profile.logout-button')}
                                <Icon name="sign out" style={{ opacity: 1 }} />
                              </Button>
                              <Button
                                primary
                                icon
                                labelPosition="right"
                                onClick={this.changePasswordToggleHandler}
                                disabled={this.props.userEmail === credentials.demo.username}
                              >
                                {this.props.translate('profile.change-password-button')}
                                <Icon name="lock" style={{ opacity: 1 }} />
                              </Button>
                            </Button.Group>
                          }
                        />
                      </Menu.Item>
                    ) : (
                      <Menu.Item fitted>
                        <Popup
                          trigger={
                            <Icon
                              fitted
                              name="sign in"
                              style={{ opacity: 1 }}
                              color="green"
                              size="big"
                              onClick={this.authToggleHandler}
                            />
                          }
                          content={this.props.translate('menu.login-popup')}
                          on="hover"
                        />
                      </Menu.Item>
                    )}
                    <Menu.Item fitted>
                      <Popup
                        trigger={
                          <Icon fitted name="talk" color="black" size="large" onClick={this.feedbackToggleHandler} />
                        }
                        content={this.props.translate('menu.feedback-popup')}
                        on="hover"
                      />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <Popup
                        trigger={
                          <Icon
                            fitted
                            name="exclamation triangle"
                            color="yellow"
                            size="large"
                            onClick={this.problemReportToggleHandler}
                          />
                        }
                        content={this.props.translate('menu.problem-report-popup')}
                        on="hover"
                      />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <Popup
                        trigger={
                          <Icon fitted name="bug" color="olive" size="large" onClick={this.bugReportToggleHandler} />
                        }
                        content={this.props.translate('menu.bug-report-popup')}
                        on="hover"
                      />
                    </Menu.Item>
                    <Menu.Item fitted>
                      <LanguageSelection />
                    </Menu.Item>
                  </Menu.Menu>
                </Menu>
              </MediaQuery>
              {children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Suspense>
      </ErrorBoundary>
    );
  }
}

Layout.propTypes = {
  path: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  userEmail: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  path: state.router.location.pathname,
  role: state.profile.role,
  isAuthenticated: state.auth.token !== null,
  profileFetched: state.profile.role !== '',
  userEmail: state.profile.email,
  firstName: state.profile.firstName,
  lastName: state.profile.lastName,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  redirect: (to) => {
    dispatch(push(to));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Layout, axios));
