import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Message, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity, translateError } from '../../shared/utility';

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

  render() {
    return (
      <Fragment>
        <Modal size="mini" open={this.props.open || !this.props.isAuthenticated}>
          <Modal.Header>{this.props.translate('auth.modal-header')}</Modal.Header>
          <Modal.Content>
            <Form error={this.props.error !== null}>
              <Form.Input
                autoFocus
                icon="user"
                iconPosition="left"
                name="email"
                value={this.state.loginForm.email.value}
                error={!this.state.loginForm.email.valid && this.state.loginForm.email.touched}
                onChange={this.inputChangeHandler}
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
                placeholder={this.props.translate('auth.password')}
                type="password"
                autoComplete="password"
                required
              />
              <Message
                error
                header={translateError(this.props.translate, this.props.error)}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              icon
              type="button"
              labelPosition="right"
              loading={this.props.loading}
              disabled={this.props.loading}
              onClick={this.onDemoLogin}
            >
              {this.props.translate('auth.demo')}
              <Icon name="sign in" style={{ opacity: 1 }} />
            </Button>
            <Button
              positive
              type="submit"
              loading={this.props.loading}
              disabled={!this.state.loginFormValid || this.props.loading}
              onClick={this.onLogin}
            >
              {this.props.translate('auth.login-button')}
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.auth.authenticating,
  isAuthenticated: state.auth.token !== null,
  error: state.auth.authenticationError,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onLogin: (email, password) => {
    dispatch(actionCreators.authLogin(email, password));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
