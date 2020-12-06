import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Form, Button, Popup, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import credentials from '../../credentials';
import { updateObject, checkValidity } from '../../shared/utility';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import ErrorMessage from '../Message/ErrorMessage';
import SuccessMessage from '../Message/SuccessMessage';

const initialState = {
  loginForm: {
    email: {
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  },
  registerForm: {
    email: {
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    emailConfirm: {
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    groupId: {
      value: '',
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
  },
  loginFormValid: false,
  registerFormValid: false,
  isSignup: false,
};

export class Auth extends Component {
  state = { ...initialState };

  onLogin = () => {
    this.props.onLogin(this.state.loginForm.email.value, this.state.loginForm.password.value);
  };

  onDemoLogin = () => {
    this.props.onLogin(credentials.demo.username, '');
  };

  onRegister = () => {
    const registerData = {
      email: this.state.registerForm.email.value,
      groupId: this.state.registerForm.groupId.value !== '' ? +this.state.registerForm.groupId.value : null,
    };
    this.props.onRegister(registerData);
  };

  onCreateToggle = () => {
    if (!this.state.isSignup && this.props.groups.length === 0) {
      this.props.onFetchGroups();
    }
    this.setState({ isSignup: !this.state.isSignup });
  };

  registerInputChangeHandler = (event, { name, value }) => {
    const updatedFormElement = updateObject(this.state.registerForm[name], {
      value,
      valid: checkValidity(value, this.state.registerForm[name].validation),
      touched: true,
    });
    const updatedRegisterForm = updateObject(this.state.registerForm, {
      [name]: updatedFormElement,
    });

    let formIsValid = true;
    for (const inputName in updatedRegisterForm) {
      formIsValid = updatedRegisterForm[inputName].valid && formIsValid;
    }
    this.setState({ registerForm: updatedRegisterForm, registerFormValid: formIsValid });
  };

  loginInputChangeHandler = (event, { name, value }) => {
    const updatedFormElement = updateObject(this.state.loginForm[name], {
      value,
      valid: checkValidity(value, this.state.loginForm[name].validation),
      touched: true,
    });
    const updatedLoginForm = updateObject(this.state.loginForm, {
      [name]: updatedFormElement,
    });

    let formIsValid = true;
    for (const inputName in updatedLoginForm) {
      formIsValid = updatedLoginForm[inputName].valid && formIsValid;
    }
    this.setState({ loginForm: updatedLoginForm, loginFormValid: formIsValid });
  };

  keyPressHandler = (event) => {
    if (
      !this.state.isSignup &&
      event.key === 'Enter' &&
      this.state.loginFormValid &&
      !this.props.authenticationStatus.loading
    ) {
      this.onLogin();
    } else if (
      this.state.isSignup &&
      event.key === 'Enter' &&
      this.state.registerFormValid &&
      !this.props.registrationStatus.loading
    ) {
      this.onRegister();
    }
  };

  render() {
    const matchingEmails = this.state.registerForm.email.value === this.state.registerForm.emailConfirm.value;
    const groupOptions = [
      {
        key: 0,
        text: this.props.translate('auth.group-not-set'),
        value: '',
      },
    ].concat(
      this.props.groups.map((group, index) => ({
        key: index + 1,
        text: group.name,
        value: group.id.toString(),
      })),
    );
    return (
      <Modal
        size="mini"
        open={this.props.open || !this.props.isAuthenticated}
        onClose={this.props.onClose}
        closeIcon={this.props.closeIcon}
      >
        <Modal.Header>
          {this.state.isSignup
            ? this.props.translate('auth.register-modal-header')
            : this.props.translate('auth.login-modal-header')}
          <LanguageSelection style={{ float: 'right' }} />
        </Modal.Header>
        <Modal.Content>
          {this.state.isSignup ? (
            <Form
              error={this.props.registrationStatus.error !== null}
              success={this.props.registrationStatus.message !== null}
            >
              <Form.Input
                autoFocus
                icon="user"
                iconPosition="left"
                name="email"
                value={this.state.registerForm.email.value}
                error={!this.state.registerForm.email.valid && this.state.registerForm.email.touched}
                onChange={this.registerInputChangeHandler}
                onKeyPress={this.keyPressHandler}
                placeholder={this.props.translate('auth.email')}
                type="email"
                required
              />
              <Form.Input
                icon="refresh"
                iconPosition="left"
                name="emailConfirm"
                value={this.state.registerForm.emailConfirm.value}
                error={
                  (!matchingEmails || !this.state.registerForm.emailConfirm.valid) &&
                  this.state.registerForm.emailConfirm.touched
                }
                onChange={this.registerInputChangeHandler}
                onKeyPress={this.keyPressHandler}
                placeholder={this.props.translate('auth.confirm-email')}
                type="email"
                required
              />
              <Form.Select
                search
                name="groupId"
                value={this.state.registerForm.groupId.value}
                options={groupOptions}
                onChange={this.registerInputChangeHandler}
                loading={this.props.groupsStatus.loading}
                placeholder={this.props.translate('auth.group')}
              />
              <SuccessMessage icon="check" message={this.props.registrationStatus.message} />
              <ErrorMessage error={this.props.registrationStatus.error} />
            </Form>
          ) : (
            <Form error={this.props.authenticationStatus.error !== null || this.props.logoutStatus.error !== null}>
              <Form.Input
                aria-label={this.props.translate('auth.username')}
                autoFocus
                icon="user"
                iconPosition="left"
                name="email"
                value={this.state.loginForm.email.value}
                error={!this.state.loginForm.email.valid && this.state.loginForm.email.touched}
                onChange={this.loginInputChangeHandler}
                onKeyPress={this.keyPressHandler}
                placeholder={this.props.translate('auth.username')}
                type="email"
                autoComplete="email"
                required
              />
              <Form.Input
                aria-label={this.props.translate('auth.password')}
                icon="lock"
                iconPosition="left"
                name="password"
                value={this.state.loginForm.password.value}
                error={!this.state.loginForm.password.valid && this.state.loginForm.password.touched}
                onChange={this.loginInputChangeHandler}
                onKeyPress={this.keyPressHandler}
                placeholder={this.props.translate('auth.password')}
                type="password"
                autoComplete="password"
                required
              />
              <ErrorMessage
                error={
                  this.props.authenticationStatus.error
                    ? this.props.authenticationStatus.error
                    : this.props.logoutStatus.error
                }
              />
            </Form>
          )}
        </Modal.Content>
        <Modal.Actions>
          {this.state.isSignup ? (
            <Button.Group fluid>
              <Button
                fluid
                positive
                type="submit"
                loading={this.props.registrationStatus.loading}
                disabled={!this.state.registerFormValid || !matchingEmails || this.props.registrationStatus.loading}
                onClick={this.onRegister}
              >
                {this.props.translate('auth.register-user')}
              </Button>
            </Button.Group>
          ) : (
            <Button.Group fluid>
              <Popup
                content={this.props.translate('auth.first-time')}
                position="bottom center"
                on="hover"
                trigger={
                  <Button
                    primary
                    type="button"
                    loading={this.props.authenticationStatus.loading}
                    disabled={this.props.authenticationStatus.loading}
                    onClick={this.onDemoLogin}
                  >
                    {this.props.translate('auth.demo')}
                  </Button>
                }
              />
              <Button
                positive
                type="submit"
                loading={this.props.authenticationStatus.loading}
                disabled={!this.state.loginFormValid || this.props.authenticationStatus.loading}
                onClick={this.onLogin}
              >
                {this.props.translate('auth.login-button')}
              </Button>
            </Button.Group>
          )}
        </Modal.Actions>
        <Modal.Actions>
          {this.state.isSignup ? (
            <Button positive type="button" onClick={this.onCreateToggle}>
              <Icon name="chevron left" />
              {this.props.translate('auth.back-to-auth')}
            </Button>
          ) : (
            <Fragment>
              {this.props.translate('auth.no-user-question')}
              <Button positive type="button" onClick={this.onCreateToggle}>
                {this.props.translate('auth.create-button')}
                <Icon name="chevron right" />
              </Button>
            </Fragment>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

Auth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authenticationStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  groupsStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  registrationStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    message: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  logoutStatus: PropTypes.shape({
    error: PropTypes.string,
  }).isRequired,
  translate: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onFetchGroups: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
  authenticationStatus: state.auth.authenticationStatus,
  groupsStatus: state.group.groupsStatus,
  groups: state.group.groups,
  registrationStatus: state.auth.registrationStatus,
  logoutStatus: state.auth.logoutStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (email, password) => {
    dispatch(actionCreators.login(email, password));
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
  onRegister: (registerData) => {
    dispatch(actionCreators.register(registerData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
