import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Tab } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { rolePermissions } from '../../store/reducers/profile';
import ManageUsers from './Users/ManageUsers';
import ManageFeedback from './Feedback/ManageFeedback';
import ManageBugReports from './BugReports/ManageBugReports';

export class Manage extends Component {
  state = {};

  render() {
    const panes = [
      {
        menuItem: {
          key: 'users',
          icon: 'users',
          content: this.props.translate('manage.users'),
        },
        render: () => (
          <Tab.Pane>
            <ManageUsers />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'feedback',
          icon: 'talk',
          content: this.props.translate('manage.feedback'),
        },
        render: () => (
          <Tab.Pane>
            <ManageFeedback />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'bug-reports',
          icon: 'bug',
          content: this.props.translate('manage.bug-reports'),
        },
        render: () => (
          <Tab.Pane>
            <ManageBugReports />
          </Tab.Pane>
        ),
      },
    ];
    const isDeveloper = rolePermissions[this.props.role] >= rolePermissions.developer;
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{this.props.translate('manage.title')}</Header>
        {isDeveloper ?
          <Tab
            panes={panes}
          /> :
          <Fragment>
            <p>{this.props.translate('manage.description')}</p>
            <ManageUsers />
          </Fragment>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  role: state.profile.role,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Manage);
