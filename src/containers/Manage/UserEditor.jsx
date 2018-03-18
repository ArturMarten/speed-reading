import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, Dropdown, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { isEmail } from '../../shared/utility';

class UserEditor extends Component {
  state = {
    groupId: null,
    email: '',
    role: 'student',
    notify: false,
    touched: false,
    valid: false,
  }

  componentDidMount() {
    if (this.props.user) {
      this.setUser(this.props.user);
    }
    setTimeout(() => {
      this.inputRef.focus();
      const { inputRef } = this.inputRef;
      const { length } = inputRef.value;
      inputRef.setSelectionRange(length, length);
    }, 100);
  }

  setUser(user) {
    this.setState({
      groupId: user.groupId,
      email: user.email,
      role: user.role,
      valid: true,
    });
  }

  addUserHandler = (event, data) => {
    const user = {
      groupId: this.state.groupId,
      email: this.state.email,
      role: this.state.role,
      notify: this.state.notify,
    };
    this.props.onAddUser(user, this.props.token);
    this.props.onClose(event, data);
  }

  changeUserHandler = (event, data) => {
    const user = {
      groupId: this.state.groupId,
      email: this.state.email,
      role: this.state.role,
      notify: this.state.notify,
    };
    this.props.onChangeUser(this.props.user.publicId, user, this.props.token);
    this.props.onClose(event, data);
  }

  userGroupChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      groupId: data.value,
    });
  }

  emailInputChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      valid: isEmail(data.value.trim()),
      email: data.value,
    });
  }

  userRoleChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      role: data.value,
    });
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.props.user) {
        this.changeUserHandler(event, {});
      } else {
        this.addUserHandler(event, {});
      }
    }
  }

  notifyChangeHandler = () => {
    this.setState({
      touched: true,
      notify: !this.state.notify,
    });
  }

  render() {
    const groupOptions = this.props.groups
      .map((group, index) => ({
        key: index,
        text: group.name,
        value: group.id,
      }));
    const roleOptions = ['student', 'teacher', 'developer', 'admin']
      .map((role, index) => ({
        key: index,
        text: this.props.translate(`manage.role-${role}`),
        value: role,
      }));
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
        closeIcon
      >
        <Modal.Header>
          {this.props.user ?
            this.props.translate('user-editor.modal-header-change') :
            this.props.translate('user-editor.modal-header-new')}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            ref={(ref) => { this.inputRef = ref; }}
            value={this.state.email}
            onChange={this.emailInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            error={!this.state.valid}
            placeholder={this.props.user ?
              this.props.translate('user-editor.insert-changed-placeholder') :
              this.props.translate('user-editor.insert-new-placeholder')}
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
        </Modal.Content>
        <Modal.Actions>
          {this.props.user ?
            <Button
              primary
              disabled={!this.state.touched || !this.state.valid}
              content={this.props.translate('user-editor.change-user')}
              onClick={this.changeUserHandler}
            /> :
            <Button
              positive
              disabled={!this.state.touched || !this.state.valid}
              content={this.props.translate('user-editor.add-user')}
              onClick={this.addUserHandler}
            />
          }
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  groups: state.manage.groups,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAddUser: (user, token) => {
    dispatch(actionCreators.addUser(user, token));
  },
  onChangeUser: (userId, user, token) => {
    dispatch(actionCreators.changeUser(userId, user, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEditor);
