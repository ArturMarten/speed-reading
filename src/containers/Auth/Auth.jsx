import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Icon, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity } from '../../shared/utility';
import ErrorMessage from '../Message/ErrorMessage';

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
  loginFormValid: false,
};

export class Auth extends Component {
  state = { ...initialState };

  onLogin = () => {
    this.props.onLogin(this.state.loginForm.email.value, this.state.loginForm.password.value);
  }

  onDemoLogin = () => {
    this.props.onLogin('***DEMO_EMAIL***', '***REMOVED***');
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedLoginForm = { ...this.state.loginForm };
    const updatedFormElement = { ...updatedLoginForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedLoginForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedLoginForm) {
      formIsValid = updatedLoginForm[inputName].valid && formIsValid;
    }
    this.setState({
      loginForm: updatedLoginForm,
      loginFormValid: formIsValid,
    });
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter' && this.state.loginFormValid && !this.props.authenticationStatus.loading) {
      this.onLogin();
    }
  }

  render() {
    return (
      <Modal size="mini" open={this.props.open || !this.props.isAuthenticated}>
        <Modal.Header>{this.props.translate('auth.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form error={this.props.authenticationStatus.error !== null || this.props.logoutError !== null}>
            <Form.Input
              autoFocus
              icon="user"
              iconPosition="left"
              name="email"
              value={this.state.loginForm.email.value}
              error={!this.state.loginForm.email.valid && this.state.loginForm.email.touched}
              onChange={this.inputChangeHandler}
              onKeyPress={this.keyPressHandler}
              placeholder={this.props.translate('auth.username')}
              type="email"
              autoComplete="email"
              required
            />
            <Form.Input
              icon="lock"
              iconPosition="left"
              name="password"
              value={this.state.loginForm.password.value}
              error={!this.state.loginForm.password.valid && this.state.loginForm.password.touched}
              onChange={this.inputChangeHandler}
              onKeyPress={this.keyPressHandler}
              placeholder={this.props.translate('auth.password')}
              type="password"
              autoComplete="password"
              required
            />
            <ErrorMessage
              error={this.props.authenticationStatus.error ? this.props.authenticationStatus.error : this.props.logoutError}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Popup
            content={this.props.translate('auth.first-time')}
            position="bottom center"
            on="hover"
            trigger={
              <Button
                primary
                icon
                type="button"
                labelPosition="right"
                loading={this.props.authenticationStatus.loading}
                disabled={this.props.authenticationStatus.loading}
                onClick={this.onDemoLogin}
              >
                {this.props.translate('auth.demo')}
                <Icon name="sign in" style={{ opacity: 1 }} />
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
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  authenticationStatus: state.auth.authenticationStatus,
  logoutError: state.auth.logoutError,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onLogin: (email, password) => {
    dispatch(actionCreators.authLogin(email, password));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
