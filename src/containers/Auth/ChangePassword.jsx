import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity } from '../../shared/utility';
import SuccessMessage from '../Message/SuccessMessage';
import ErrorMessage from '../Message/ErrorMessage';

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
  state = { ...initialState };

  onPasswordChange = () => {
    const { oldPassword, newPassword } = this.state.passwordChangeForm;
    this.props.onPasswordChange(oldPassword.value, newPassword.value);
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

  render() {
    const matchingPasswords = this.state.passwordChangeForm.newPassword.value === this.state.passwordChangeForm.newPasswordConfirm.value;
    return (
      <Modal size="mini" open={this.props.open} closeOnDimmerClick={false} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('change-password.modal-header')}
        </Modal.Header>
        <Modal.Content>
          <Form error={this.props.passwordChangeStatus.error !== null} success={this.props.passwordChangeStatus.message !== null}>
            <Form.Input
              aria-label={this.props.translate('change-password.old-password')}
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
              aria-label={this.props.translate('change-password.new-password')}
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
              aria-label={this.props.translate('change-password.confirm-new-password')}
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
            <SuccessMessage
              icon="check"
              message={this.props.passwordChangeStatus.message}
            />
            <ErrorMessage
              error={this.props.passwordChangeStatus.error}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            type="submit"
            loading={this.props.passwordChangeStatus.loading}
            disabled={!this.state.passwordChangeFormValid || !matchingPasswords || this.props.passwordChangeStatus.loading}
            onClick={this.onPasswordChange}
          >
            {this.props.translate('change-password.change')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

ChangePassword.propTypes = {
  passwordChangeStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    message: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  translate: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  passwordChangeStatus: state.auth.passwordChangeStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onPasswordChange: (oldPassword, newPassword) => {
    dispatch(actionCreators.changePassword(oldPassword, newPassword));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
