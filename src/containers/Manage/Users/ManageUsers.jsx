import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Icon, Segment, Loader, Form, Dropdown } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { sortByColumn } from '../../../shared/utility';
import { rolePermissions } from '../../../store/reducers/profile';
import UserEditor from './UserEditor';

export class ManageUsers extends Component {
  state = {
    userEditorOpened: false,
    selectedUser: null,
    column: 'lastLogin',
    direction: 'descending',
    groupId: 'all-groups',
  };

  componentDidMount() {
    if (this.props.users.length === 0) {
      this.props.onFetchUsers(this.props.token);
    }
    if (this.props.groups.length === 0) {
      this.props.onFetchGroups();
    }
  }

  onRefresh = () => {
    this.props.onFetchUsers(this.props.token);
    this.props.onFetchGroups();
  }

  getGroupNameById = (groupId) => {
    const foundGroup = this.props.groups.filter(group => group.id === groupId);
    if (foundGroup.length > 0) {
      return foundGroup[0].name;
    }
    return '';
  }

  groupChangeHandler = (event, { value }) => {
    this.setState({ groupId: value });
  }

  sortHandler = selectedColumn => () => {
    const { column, direction } = this.state;
    if (column !== selectedColumn) {
      this.setState({
        column: selectedColumn,
        direction: 'ascending',
      });
    } else {
      this.setState({
        direction: direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  };

  userEditorToggleHandler = (event, data) => {
    this.setState({
      userEditorOpened: !this.state.userEditorOpened,
      selectedUser: data && data.user ? data.user : null,
    });
  }

  changePermission = role => rolePermissions[this.props.role] >= rolePermissions[role];

  render() {
    const { column, direction } = this.state;
    const groupOptions = [{
      key: -1,
      text: this.props.translate('manage-users.all-groups'),
      value: 'all-groups',
    }].concat(this.props.groups
      .map((group, index) => ({ key: index, value: group.id, text: group.name })));
    const users = this.props.users
      .filter(user => this.state.groupId === 'all-groups' || user.groupId === this.state.groupId);
    const sortedUsers = sortByColumn(users, column, direction);
    return (
      <Fragment>
        {this.state.userEditorOpened ?
          <UserEditor
            open={this.state.userEditorOpened}
            onClose={this.userEditorToggleHandler}
            user={this.state.selectedUser}
          /> : null}
        <Button
          positive
          compact
          floated="right"
          loading={this.props.usersStatus.loading || this.props.groupsStatus.loading}
          disabled={this.props.usersStatus.loading || this.props.groupsStatus.loading}
          onClick={this.onRefresh}
          style={{ marginBottom: '5px' }}
        >
          <Icon name="refresh" />
          {this.props.translate('manage-users.refresh')}
        </Button>
        <Form>
          <Form.Field
            id="group-dropdown"
            fluid
            inline
            search
            selection
            value={this.state.groupId}
            onChange={this.groupChangeHandler}
            options={groupOptions}
            loading={this.props.groupsStatus.loading}
            label={this.props.translate('manage-users.group')}
            control={Dropdown}
          />
        </Form>
        {this.props.usersStatus.loading || this.props.groupsStatus.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('manage-users.fetching-users')} />
          </Segment> :
          <Fragment>
            <Table basic celled selectable compact="very" sortable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell sorted={column === 'groupId' ? direction : null} onClick={this.sortHandler('groupId')}>
                    {this.props.translate('manage-users.group')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'firstName' ? direction : null} onClick={this.sortHandler('firstName')}>
                    {this.props.translate('manage-users.first-name')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'lastName' ? direction : null} onClick={this.sortHandler('lastName')}>
                    {this.props.translate('manage-users.last-name')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'email' ? direction : null} onClick={this.sortHandler('email')}>
                    {this.props.translate('manage-users.email')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'registrationDate' ? direction : null} onClick={this.sortHandler('registrationDate')}>
                    {this.props.translate('manage-users.registration')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'lastLogin' ? direction : null} onClick={this.sortHandler('lastLogin')}>
                    {this.props.translate('manage-users.last-login')}
                  </Table.HeaderCell>
                  <Table.HeaderCell sorted={column === 'role' ? direction : null} onClick={this.sortHandler('role')}>
                    {this.props.translate('manage-users.role')}
                  </Table.HeaderCell>
                  <Table.HeaderCell collapsing />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedUsers.map(user => (
                  <Table.Row key={user.publicId} active={user.publicId === this.props.userId}>
                    <Table.Cell negative={!user.groupId}>
                      {user.groupId ? this.getGroupNameById(user.groupId) :
                      <Fragment>
                        <Icon name="attention" />
                        {this.props.translate('manage-users.group-missing')}
                      </Fragment>}
                    </Table.Cell>
                    <Table.Cell>
                      {user.firstName}
                    </Table.Cell>
                    <Table.Cell>
                      {user.lastName}
                    </Table.Cell>
                    <Table.Cell>
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                      {new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }).format(user.registrationDate)}
                    </Table.Cell>
                    <Table.Cell negative={!user.lastLogin}>
                      {user.lastLogin ?
                        new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour12: false,
                          hour: 'numeric',
                          minute: 'numeric',
                        }).format(user.lastLogin) : this.props.translate('manage-users.last-login-never')}
                    </Table.Cell>
                    <Table.Cell>
                      {this.props.translate(`manage-users.role-${user.role}`)}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        primary
                        compact
                        content={this.props.translate('manage-users.change')}
                        disabled={!this.changePermission(user.role) || user.publicId === this.props.userId}
                        onClick={event => this.userEditorToggleHandler(event, { user })}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan="7">
                    <Button
                      positive
                      floated="right"
                      content={this.props.translate('manage-users.add-user')}
                      onClick={this.userEditorToggleHandler}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Fragment>}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  role: state.profile.role,
  usersStatus: state.user.usersStatus,
  users: state.user.users,
  groupsStatus: state.group.groupsStatus,
  groups: state.group.groups,
  token: state.auth.token,
  userId: state.auth.userId,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
