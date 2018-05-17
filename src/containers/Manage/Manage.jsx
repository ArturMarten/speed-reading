import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Tab } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { rolePermissions } from '../../store/reducers/profile';
import ManageGroups from './Groups/ManageGroups';
import ManageUsers from './Users/ManageUsers';
import ManageFeedback from './Feedback/ManageFeedback';
import ManageBugReports from './BugReports/ManageBugReports';

export class Manage extends Component {
  state = {
    isDeveloper: rolePermissions[this.props.role] >= rolePermissions.developer,
  };

  render() {
    const teacherPanes = [
      {
        menuItem: {
          key: 'groups',
          icon: 'group',
          content: this.props.translate('manage.groups'),
        },
        render: () => (
          <Tab.Pane>
            <div style={{ overflowX: 'auto' }}>
              <ManageGroups />
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'users',
          icon: 'user',
          content: this.props.translate('manage.users'),
        },
        render: () => (
          <Tab.Pane>
            <div style={{ overflowX: 'auto' }}>
              <ManageUsers />
            </div>
          </Tab.Pane>
        ),
      },
    ];
    const developerPanes = [
      ...teacherPanes,
      {
        menuItem: {
          key: 'feedback',
          icon: 'talk',
          content: this.props.translate('manage.feedback'),
        },
        render: () => (
          <Tab.Pane>
            <div style={{ overflowX: 'auto' }}>
              <ManageFeedback />
            </div>
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
            <div style={{ overflowX: 'auto' }}>
              <ManageBugReports />
            </div>
          </Tab.Pane>
        ),
      },
    ];
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{this.props.translate('manage.title')}</Header>
        {this.state.isDeveloper ?
          <Tab
            defaultActiveIndex={1}
            panes={developerPanes}
          /> :
          <Tab
            defaultActiveIndex={1}
            panes={teacherPanes}
          />}
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
