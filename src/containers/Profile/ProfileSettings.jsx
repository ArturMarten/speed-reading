import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity } from '../../shared/utility';
import SuccessMessage from '../Message/SuccessMessage';
import ErrorMessage from '../Message/ErrorMessage';

const initialState = {
  userProfileForm: {
    firstName: {
      value: '',
      validation: {
        required: false,
        maxLength: 50,
      },
      valid: true,
      touched: false,
    },
    lastName: {
      value: '',
      validation: {
        required: false,
        maxLength: 50,
      },
      valid: true,
      touched: false,
    },
  },
  userProfileFormValid: true,
};

export class ProfileSettings extends Component {
  state = { ...initialState };

  componentDidMount() {
    this.checkProfile();
  }

  componentDidUpdate() {
    this.checkProfile();
  }

  checkProfile = () => {
    if (this.state.userProfileForm.firstName.value === '' && this.props.firstName !== '') {
      this.setState({
        userProfileForm: {
          ...this.state.userProfileForm,
          firstName: {
            ...this.state.userProfileForm.firstName,
            value: this.props.firstName,
          },
        },
      });
    }
    if (this.state.userProfileForm.lastName.value === '' && this.props.lastName !== '') {
      this.setState({
        userProfileForm: {
          ...this.state.userProfileForm,
          lastName: {
            ...this.state.userProfileForm.lastName,
            value: this.props.lastName,
          },
        },
      });
    }
  }

  onSaveUserProfile = () => {
    console.log('Saving profile');
    const userProfileData = {
      firstName: this.state.userProfileForm.firstName.value,
      lastName: this.state.userProfileForm.lastName.value,
    };
    this.props.onUserProfileSave(this.props.userId, userProfileData);
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedUserProfileForm = { ...this.state.userProfileForm };
    const updatedFormElement = { ...updatedUserProfileForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedUserProfileForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedUserProfileForm) {
      formIsValid = updatedUserProfileForm[inputName].valid && formIsValid;
    }
    this.setState({
      userProfileForm: updatedUserProfileForm,
      userProfileFormValid: formIsValid,
    });
  }


  render() {
    return (
      <Modal size="small" open={this.props.open} closeOnDimmerClick={false} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('profile-settings.modal-header')}
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              id="name-input"
              type="text"
              name="firstName"
              label={this.props.translate('profile-settings.first-name')}
              value={this.state.userProfileForm.firstName.value}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('profile-settings.please-enter-first-name')}
            />
          </Form>
          <Form>
            <Form.Input
              id="name-input"
              type="text"
              name="lastName"
              label={this.props.translate('profile-settings.last-name')}
              value={this.state.userProfileForm.lastName.value}
              onChange={this.inputChangeHandler}
              placeholder={this.props.translate('profile-settings.please-enter-last-name')}
            />
          </Form>
        </Modal.Content>
        <SuccessMessage
          icon="check"
          style={{ margin: '0 0' }}
          message={this.props.profileStatus.message !== null ? this.props.profileStatus.message : null}
        />
        <ErrorMessage
          style={{ margin: '0 0' }}
          error={this.props.profileStatus.error !== null ? this.props.profileStatus.error : null}
        />
        <Modal.Actions>
          <Button
            positive
            type="button"
            onClick={this.onSaveUserProfile}
            disabled={!this.state.userProfileFormValid || this.props.profileStatus.loading}
            loading={this.props.profileStatus.loading}
          >
            {this.props.translate('profile-settings.save')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  profileStatus: state.profile.profileStatus,
  firstName: state.profile.firstName,
  lastName: state.profile.lastName,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
  onUserProfileSave: (userId, userProfileData) => {
    dispatch(actionCreators.saveUserProfile(userId, userProfileData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
