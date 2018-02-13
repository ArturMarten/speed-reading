import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Modal, Form, Button, Icon, Label} from 'semantic-ui-react';
import Aux from '../../hoc/Auxiliary';

const initialState = {
  open: false,
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  inputChangeHandler(event, {name, value}) {
    const updatedLoginForm = {...this.state.loginForm};
    const updatedFormElement = {...updatedLoginForm[name]};
    updatedFormElement.value = value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedLoginForm[name] = updatedFormElement;
    let formIsValid = true;
    for (let inputName in updatedLoginForm) {
      formIsValid = updatedLoginForm[inputName].valid && formIsValid;
    }
    this.setState({loginForm: updatedLoginForm, loginFormValid: formIsValid});
  }

  openClickHandler() {
    this.setState({open: true});
  }

  closeClickHandler() {
    this.setState({...initialState});
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }
    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }
    if ( rules.isEmail ) {
      // eslint-disable-next-line
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  }

  onLogin() {
    this.props.onLogin(this.state.loginForm.email.value, this.state.loginForm.password.value);
  }

  onLogout() {
    this.props.onLogout();
  }

  render() {
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to='/' />;
    }
    const authButton = this.props.isAuthenticated ?
      <Button positive icon labelPosition='right' onClick={() => this.onLogout()}>
        Logi välja
        <Icon name='sign out' style={{opacity: 1}}></Icon>
      </Button> :
      <Button positive icon labelPosition='right' onClick={() => this.openClickHandler()}>
        {this.props.translate('login.login-button')}
        <Icon name='sign in' style={{opacity: 1}}></Icon>
      </Button>;
    return (
      <Aux>
        {authRedirect}
        {authButton}
        <Modal size='mini' open={this.state.open && !this.props.isAuthenticated} onClose={() => this.closeClickHandler()}>
          <Modal.Header>{this.props.translate('login.modal-header')}</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input icon='user' iconPosition='left'
                name='email' required
                value={this.state.loginForm.email.value}
                error={!this.state.loginForm.email.valid && this.state.loginForm.email.touched}
                onChange={(event, data) => this.inputChangeHandler(event, data)}
                placeholder={this.props.translate('login.username')} type='email'
                autoComplete='email' />
              <Form.Input icon='lock'
                iconPosition='left'
                name='password' required
                value={this.state.loginForm.password.value}
                error={!this.state.loginForm.password.valid && this.state.loginForm.password.touched}
                onChange={(event, data) => this.inputChangeHandler(event, data)}
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
              onClick={() => this.onLogin()}
            >
              {this.props.translate('login.sign-in')}
            </Button>
          </Modal.Actions>
        </Modal>
      </Aux>
    );
  }
}

export default Login;
