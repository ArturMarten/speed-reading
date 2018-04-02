import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Rating, TextArea, Message, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { checkValidity } from '../../shared/utility';

const MAX_RATING = 5;

const initialState = {
  feedbackForm: {
    functionalityRating: {
      value: 0,
      valid: true,
      touched: false,
    },
    usabilityRating: {
      value: 0,
      valid: true,
      touched: false,
    },
    designRating: {
      value: 0,
      valid: true,
      touched: false,
    },
    message: {
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
  },
  feedbackFormValid: false,
};

export class Feedback extends Component {
  state = { ...initialState };

  onSubmit = () => {
    const submittedForm = {
      message: this.state.feedbackForm.message.value,
      functionalityRating: this.state.feedbackForm.functionalityRating.value,
      usabilityRating: this.state.feedbackForm.usabilityRating.value,
      designRating: this.state.feedbackForm.designRating.value,
    };
    this.props.onSubmit(submittedForm);
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedFeedbackForm = { ...this.state.feedbackForm };
    const updatedFormElement = { ...updatedFeedbackForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedFeedbackForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedFeedbackForm) {
      formIsValid = updatedFeedbackForm[inputName].valid && formIsValid;
    }
    this.setState({
      feedbackForm: updatedFeedbackForm,
      feedbackFormValid: formIsValid,
    });
  }

  render() {
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('feedback.modal-header')}</Modal.Header>
        <Modal.Content>
          <Form loading={this.props.loading} success={this.props.sent}>
            <Form.Group>
              <Form.Field disabled={this.props.sent}>
                <label htmlFor="functionality-rating">
                  <div>{this.props.translate('feedback.functionality-rating')}</div>
                  <Rating
                    id="functionality-rating"
                    clearable
                    icon="star"
                    size="huge"
                    maxRating={MAX_RATING}
                    name="functionalityRating"
                    rating={this.state.feedbackForm.functionalityRating.value}
                    onRate={(event, data) => this.inputChangeHandler(event, { ...data, value: data.rating })}
                  />
                </label>
              </Form.Field>
              <Form.Field disabled={this.props.sent}>
                <label htmlFor="usability-rating">
                  <div>{this.props.translate('feedback.usability-rating')}</div>
                  <Rating
                    id="usability-rating"
                    clearable
                    icon="star"
                    size="huge"
                    maxRating={MAX_RATING}
                    name="usabilityRating"
                    rating={this.state.feedbackForm.usabilityRating.value}
                    onRate={(event, data) => this.inputChangeHandler(event, { ...data, value: data.rating })}
                  />
                </label>
              </Form.Field>
              <Form.Field disabled={this.props.sent}>
                <label htmlFor="design-rating">
                  <div>{this.props.translate('feedback.design-rating')}</div>
                  <Rating
                    id="design-rating"
                    clearable
                    icon="star"
                    size="huge"
                    maxRating={MAX_RATING}
                    name="designRating"
                    rating={this.state.feedbackForm.designRating.value}
                    onRate={(event, data) => this.inputChangeHandler(event, { ...data, value: data.rating })}
                  />
                </label>
              </Form.Field>
            </Form.Group>
            <Form.Field error={!this.state.feedbackForm.message.valid && this.state.feedbackForm.message.touched} disabled={this.props.sent}>
              <label htmlFor="feedback-message">
                <div>{this.props.translate('feedback.textarea-message')}</div>
                <TextArea
                  id="feedback-message"
                  name="message"
                  autoHeight
                  rows={6}
                  placeholder={this.props.translate('feedback.textarea-placeholder')}
                  value={this.state.feedbackForm.message.value}
                  onChange={this.inputChangeHandler}
                />
              </label>
            </Form.Field>
            <Form.Field disabled={this.props.sent} style={{ margin: 0 }}>
              <Checkbox label={this.props.translate('feedback.anonymous')} />
            </Form.Field>
            <Message
              success
              icon="check"
              header={this.props.translate('feedback.sent-message-header')}
              content={this.props.translate('feedback.sent-message-content')}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            type="button"
            disabled={!this.state.feedbackFormValid || this.props.loading || this.props.sent}
            onClick={this.onSubmit}
          >
            {this.props.translate('feedback.send')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.feedback.loading,
  sent: state.feedback.sent,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (feedback) => {
    dispatch(actionCreators.sendFeedback(feedback));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
