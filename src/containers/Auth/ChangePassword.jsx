import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Message } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity, translateError } from '../../shared/utility';

const initialState = {
  passwordChangeForm: {
    oldPassword: {
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
    newPassword: {
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
    newPasswordConfirm: {
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  },
  passwordChangeFormValid: false,
};

export class ChangePassword extends Component {
  state = { ...initialState, changed: false };

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading && this.props.error === null) {
      this.passwordChanged();
    }
  }

  onPasswordChange = () => {
    const { oldPassword, newPassword } = this.state.passwordChangeForm;
    this.props.onPasswordChange(oldPassword.value, newPassword.value, this.props.token);
    this.setState({ changed: false });
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedPasswordChangeForm = { ...this.state.passwordChangeForm };
    const updatedFormElement = { ...updatedPasswordChangeForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedPasswordChangeForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedPasswordChangeForm) {
      formIsValid = updatedPasswordChangeForm[inputName].valid && formIsValid;
    }
    this.setState({
      passwordChangeForm: updatedPasswordChangeForm,
      passwordChangeFormValid: formIsValid,
    });
  }

  passwordChanged = () => {
    this.setState({ ...initialState, changed: true });
  }

  render() {
    const matchingPasswords = this.state.passwordChangeForm.newPassword.value === this.state.passwordChangeForm.newPasswordConfirm.value;
    return (
      <Modal size="mini" open={this.props.open} closeOnDimmerClick={false} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('change-password.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form error={this.props.error !== null} success={this.state.changed}>
            <Form.Input
              icon="lock"
              autoFocus
              iconPosition="left"
              name="oldPassword"
              value={this.state.passwordChangeForm.oldPassword.value}
              error={!this.state.passwordChangeForm.oldPassword.valid && this.state.passwordChangeForm.oldPassword.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('change-password.old-password')}
              type="password"
              autoComplete="current-password"
              required
            />
            <Form.Input
              icon="refresh"
              iconPosition="left"
              name="newPassword"
              value={this.state.passwordChangeForm.newPassword.value}
              error={!this.state.passwordChangeForm.newPassword.valid && this.state.passwordChangeForm.newPassword.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('change-password.new-password')}
              type="password"
              autoComplete="new-password"
              required
            />
            <Form.Input
              icon="refresh"
              iconPosition="left"
              name="newPasswordConfirm"
              value={this.state.passwordChangeForm.newPasswordConfirm.value}
              error={
               (!matchingPasswords ||
                !this.state.passwordChangeForm.newPasswordConfirm.valid) &&
                this.state.passwordChangeForm.newPasswordConfirm.touched}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('change-password.confirm-new-password')}
              type="password"
              autoComplete="new-password"
              required
            />
            <Message
              error
              header={translateError(this.props.translate, this.props.error)}
            />
            <Message
              success
              header={this.props.translate('change-password.password-changed')}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            type="submit"
            loading={this.props.loading}
            disabled={!this.state.passwordChangeFormValid || !matchingPasswords || this.props.loading}
            onClick={this.onPasswordChange}
          >
            {this.props.translate('change-password.change')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  loading: state.auth.changingPassword,
  error: state.auth.changePasswordError,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onPasswordChange: (oldPassword, newPassword, token) => {
    dispatch(actionCreators.changePassword(oldPassword, newPassword, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
