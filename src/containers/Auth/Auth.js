import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {Modal, Form, Button, Label} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {checkValidity} from '../../shared/utility';

const initialState = {
  loginForm: {
    email: {
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  },
  loginFormValid: false
};

export class Auth extends Component {
  state = {
    ...initialState
  }

  inputChangeHandler = (event, {name, value}) => {
    const updatedLoginForm = {...this.state.loginForm};
    const updatedFormElement = {...updatedLoginForm[name]};
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedLoginForm[name] = updatedFormElement;
    let formIsValid = true;
    for (let inputName in updatedLoginForm) {
      formIsValid = updatedLoginForm[inputName].valid && formIsValid;
    }
    this.setState({loginForm: updatedLoginForm, loginFormValid: formIsValid});
  }

  onLogin = () => {
    this.props.onLogin(this.state.loginForm.email.value, this.state.loginForm.password.value);
  }

  render() {
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to='/' />;
    }
    return (
      <Aux>
        {authRedirect}
        <Modal size='mini' open={this.props.open && !this.props.isAuthenticated} onClose={this.props.onClose}>
          <Modal.Header>{this.props.translate('login.modal-header')}</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input icon='user' iconPosition='left'
                name='email' required
                value={this.state.loginForm.email.value}
                error={!this.state.loginForm.email.valid && this.state.loginForm.email.touched}
                onChange={this.inputChangeHandler}
                placeholder={this.props.translate('login.username')} type='email'
                autoComplete='email' />
              <Form.Input icon='lock'
                iconPosition='left'
                name='password' required
                value={this.state.loginForm.password.value}
                error={!this.state.loginForm.password.valid && this.state.loginForm.password.touched}
                onChange={this.inputChangeHandler}
                placeholder={this.props.translate('login.password')} type='password'
                autoComplete='password' />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {this.props.error ? <Label basic color='red'>{this.props.error}</Label> : null}
            <Button positive
              type='submit'
              loading={this.props.loading}
              disabled={!this.state.loginFormValid || this.props.loading}
              onClick={this.onLogin}
            >
              {this.props.translate('login.sign-in')}
            </Button>
          </Modal.Actions>
        </Modal>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.token !== null,
  error: state.auth.error,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (email, password) => {
    dispatch(actionCreators.authLogin(email, password));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
