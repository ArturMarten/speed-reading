import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Table, Menu, Button, Icon, Segment, Loader } from 'semantic-ui-react';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import GroupEditor from './GroupEditor';
import UserEditor from './UserEditor';

export class Manage extends Component {
  state = {
    groupEditorOpened: false,
    userEditorOpened: false,
    selectedUser: null,
  };

  componentDidMount() {
    this.props.onFetchUsers(this.props.token);
    this.props.onFetchGroups(this.props.token);
  }

  getGroupNameById = (groupId) => {
    const foundGroup = this.props.groups.filter(group => group.id === groupId);
    if (foundGroup.length > 0) {
      return foundGroup[0].name;
    }
    return '';
  }

  groupEditorToggleHandler = () => {
    this.setState({
      groupEditorOpened: !this.state.groupEditorOpened,
    });
  }

  userEditorToggleHandler = (event, data) => {
    this.setState({
      userEditorOpened: !this.state.userEditorOpened,
      selectedUser: data.user ? data.user : null,
    });
  }

  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('manage.title')}</Header>
        <p>{this.props.translate('manage.description')}</p>
        {this.state.groupEditorOpened ?
          <GroupEditor
            open={this.state.groupEditorOpened}
            onClose={this.groupEditorToggleHandler}
          /> : null}
        {this.state.userEditorOpened ?
          <UserEditor
            open={this.state.userEditorOpened}
            onClose={this.userEditorToggleHandler}
            user={this.state.selectedUser}
          /> : null}
        {this.props.loading ?
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('manage.fetching-users')} />
          </Segment> :
          <Table basic celled selectable compact sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <Icon.Group onClick={this.groupEditorToggleHandler}>
                    <Icon name="group" />
                    <Icon corner name="add" />
                  </Icon.Group>
                  {this.props.translate('manage.table-group')}
                </Table.HeaderCell>
                <Table.HeaderCell>{this.props.translate('manage.table-email')}</Table.HeaderCell>
                <Table.HeaderCell>{this.props.translate('manage.table-registration')}</Table.HeaderCell>
                <Table.HeaderCell>{this.props.translate('manage.table-last-login')}</Table.HeaderCell>
                <Table.HeaderCell>{this.props.translate('manage.table-role')}</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.props.users.map(user => (
                <Table.Row key={user.publicId}>
                  <Table.Cell>
                    {this.getGroupNameById(user.groupId)}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{
                    new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    }).format(new Date(user.registrationDate))}
                  </Table.Cell>
                  <Table.Cell negative={!user.lastLogin}>{
                    user.lastLogin ?
                    new Intl.DateTimeFormat((this.props.currentLanguage === 'ee' ? 'et-EE' : 'en-GB'), {
                      year: 'numeric', month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,
                    }).format(new Date(user.lastLogin)) : this.props.translate('manage.last-login-never')}
                  </Table.Cell>
                  <Table.Cell>{this.props.translate(`manage.role-${user.role}`)}</Table.Cell>
                  <Table.Cell collapsing>
                    <Button
                      primary
                      compact
                      content={this.props.translate('manage.table-change')}
                      disabled={user.role === 'admin'}
                      onClick={event => this.userEditorToggleHandler(event, { user })}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="6">
                  <Button
                    positive
                    floated="right"
                    content={this.props.translate('manage.table-add-user')}
                    onClick={this.userEditorToggleHandler}
                  />
                  <Menu floated="right" pagination compact>
                    <Menu.Item as="a" icon>
                      <Icon name="chevron left" />
                    </Menu.Item>
                    <Menu.Item as="a">1</Menu.Item>
                    <Menu.Item as="a" icon>
                      <Icon name="chevron right" />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.manage.loading,
  users: state.manage.users,
  groups: state.manage.groups,
  token: state.auth.token,
  translate: getTranslate(state.locale),
  currentLanguage: getActiveLanguage(state.locale).code,
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchGroups: (token) => {
    dispatch(actionCreators.fetchGroups(token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Manage);
