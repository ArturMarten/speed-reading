import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, Dropdown, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { isEmail, focusInput } from '../../../shared/utility';
import { rolePermissions } from '../../../store/reducers/profile';
import ErrorMessage from '../../Message/ErrorMessage';

export class UserEditor extends Component {
  state = {
    groupId: '',
    email: '',
    role: 'student',
    notify: false,
    touched: false,
    valid: false,
    submitted: false,
  };

  componentDidMount() {
    if (this.props.user) {
      this.setUser(this.props.user);
    }
    focusInput(this.inputRef);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userStatus.loading && !this.props.userStatus.loading && this.props.userStatus.error === null) {
      this.props.onClose();
    }
  }

  setUser(user) {
    this.setState({
      groupId: user.groupId ? user.groupId.toString() : '',
      email: user.email,
      role: user.role,
      valid: true,
    });
  }

  addUserHandler = () => {
    const user = {
      groupId: this.state.groupId,
      email: this.state.email,
      role: this.state.role,
      notify: this.state.notify,
    };
    this.props.onAddUser(user);
    this.setState({ submitted: true });
  };

  changeUserHandler = () => {
    const { groupId, email, role, notify } = this.state;
    const user = {
      groupId: groupId.value !== '' ? Number.parseInt(groupId, 10) : null,
      email,
      role,
      notify,
    };
    this.props.onChangeUser(this.props.user.publicId, user);
    this.setState({ submitted: true });
  };

  userGroupChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      groupId: data.value,
    });
  };

  emailInputChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      valid: isEmail(data.value.trim()),
      email: data.value,
    });
  };

  userRoleChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      role: data.value,
    });
  };

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.props.user) {
        this.changeUserHandler(event, {});
      } else {
        this.addUserHandler(event, {});
      }
    }
  };

  notifyChangeHandler = () => {
    this.setState({
      touched: true,
      notify: !this.state.notify,
    });
  };

  render() {
    const groupOptions = [
      {
        key: 0,
        text: this.props.translate('manage-users.group-not-set'),
        value: '',
      },
    ].concat(
      this.props.groups.map((group, index) => ({
        key: index + 1,
        text: group.name,
        value: group.id.toString(),
      })),
    );
    const roleOptions = ['student', 'statistician', 'editor', 'teacher', 'developer', 'admin']
      .filter((role) => rolePermissions[role] <= rolePermissions[this.props.role])
      .map((role, index) => ({
        key: index,
        text: this.props.translate(`manage-users.role-${role}`),
        value: role,
      }));
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="small" closeIcon>
        <Modal.Header>
          {this.props.user
            ? this.props.translate('user-editor.modal-header-change')
            : this.props.translate('user-editor.modal-header-new')}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            ref={(ref) => {
              this.inputRef = ref;
            }}
            value={this.state.email}
            onChange={this.emailInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            error={!this.state.valid}
            placeholder={
              this.props.user
                ? this.props.translate('user-editor.insert-changed-placeholder')
                : this.props.translate('user-editor.insert-new-placeholder')
            }
          >
            <Dropdown
              compact
              selection
              value={this.state.groupId}
              onChange={this.userGroupChangeHandler}
              options={groupOptions}
              disabled={this.props.groups.length === 0}
              placeholder={this.props.translate('user-editor.group-placeholder')}
            />
            <input disabled={this.props.user !== null} />
            <Dropdown
              compact
              selection
              value={this.state.role}
              onChange={this.userRoleChangeHandler}
              options={roleOptions}
            />
          </Input>
          <Checkbox
            style={{ paddingTop: '1vh', display: 'flex', justifyContent: 'flex-end' }}
            checked={this.state.notify}
            onChange={this.notifyChangeHandler}
            label={this.props.translate('user-editor.notify-user-password')}
          />
          {this.props.userStatus.error && this.state.submitted ? (
            <ErrorMessage error={this.props.userStatus.error} />
          ) : null}
        </Modal.Content>
        <Modal.Actions>
          {this.props.user ? (
            <Button
              primary
              loading={this.props.userStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.userStatus.loading}
              content={this.props.translate('user-editor.change-user')}
              onClick={this.changeUserHandler}
            />
          ) : (
            <Button
              positive
              loading={this.props.userStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.userStatus.loading}
              content={this.props.translate('user-editor.add-user')}
              onClick={this.addUserHandler}
            />
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  userStatus: state.user.userStatus,
  role: state.profile.role,
  groups: state.group.groups,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onAddUser: (user) => {
    dispatch(actionCreators.addUser(user));
  },
  onChangeUser: (userId, user) => {
    dispatch(actionCreators.changeUser(userId, user));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEditor);
