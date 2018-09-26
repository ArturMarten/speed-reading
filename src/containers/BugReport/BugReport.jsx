import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, TextArea, Image, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';
import html2canvas from 'html2canvas';
import { environment } from '../../environment';

import * as actionCreators from '../../store/actions';
import { errorData } from '../../utils/errorReporter';
import { actionData } from '../../utils/actionsReporter';
import { updateObject, checkValidity, stopPropagation } from '../../shared/utility';
import ErrorMessage from '../Message/ErrorMessage';
import SuccessMessage from '../Message/SuccessMessage';

const initialState = {
  bugReportForm: {
    description: {
      value: '',
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
  },
  bugReportFormValid: false,
  sendScreenshot: true,
  screenshotImage: null,
  screenshotOpen: false,
};

export class BugReport extends Component {
  state = { ...initialState };

  componentDidMount() {
    html2canvas(document.querySelector('#root'), { logging: false }).then((canvas) => {
      this.setState({
        screenshotImage: canvas.toDataURL('image/png'),
      });
    });
  }

  onSubmit = () => {
    const submittedForm = {
      userId: this.props.userId,
      description: this.state.bugReportForm.description.value,
      version: environment.version,
      userAgent: window && window.navigator ? window.navigator.userAgent : 'Unknown',
      platform: window && window.navigator ? window.navigator.platform : 'Unknown',
      windowDimensions: window ? [window.innerWidth, window.innerHeight] : [],
      consoleErrors: errorData.getErrors(),
      state: updateObject(this.props.state, { locale: undefined, bugReport: undefined }),
      actions: actionData.getActions(3),
      screenshot: this.state.sendScreenshot && this.state.screenshotImage ?
        this.state.screenshotImage.replace(/^data:image\/\w+;base64,/, '') : null,
    };
    this.props.onSubmit(submittedForm);
  }

  openScreenshotToggle = (event) => {
    stopPropagation(event);
    this.setState({ screenshotOpen: !this.state.screenshotOpen });
  }

  inputChangeHandler = (event, { name, value }) => {
    const updatedBugReportForm = { ...this.state.bugReportForm };
    const updatedFormElement = { ...updatedBugReportForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedBugReportForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedBugReportForm) {
      formIsValid = updatedBugReportForm[inputName].valid && formIsValid;
    }
    this.setState({
      bugReportForm: updatedBugReportForm,
      bugReportFormValid: formIsValid,
    });
  }

  changeSendScreenshot = () => {
    this.setState({ sendScreenshot: !this.state.sendScreenshot });
  }

  render() {
    const screenshotModal = (
      <Modal open={this.state.screenshotOpen} closeOnDimmerClick={false} onClose={this.openScreenshotToggle} closeIcon>
        <Image
          bordered
          centered
          size="huge"
          src={this.state.screenshotImage}
          alt={this.props.translate('bug-report.screenshot-alt')}
        />
      </Modal>
    );
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('bug-report.modal-header')}
        </Modal.Header>
        <Modal.Content>
          {screenshotModal}
          <Form
            loading={this.props.bugReportStatus.loading}
            success={this.props.bugReportStatus.message !== null}
            error={this.props.bugReportStatus.error !== null}
          >
            <Form.Field error={!this.state.bugReportForm.description.valid && this.state.bugReportForm.description.touched}>
              <label htmlFor="bug-report-description">
                <div>
                  {this.props.translate('bug-report.textarea-description')}
                </div>
                <TextArea
                  id="bug-report-description"
                  name="description"
                  autoHeight
                  rows={6}
                  placeholder={this.props.translate('bug-report.textarea-placeholder')}
                  value={this.state.bugReportForm.description.value}
                  onChange={this.inputChangeHandler}
                />
              </label>
            </Form.Field>
            <Form.Field inline>
              <Image
                inline
                bordered
                src={this.state.screenshotImage}
                size="small"
                onClick={this.openScreenshotToggle}
                alt={this.props.translate('bug-report.screenshot-alt')}
              />
              <Checkbox
                label={this.props.translate('bug-report.send-screenshot')}
                checked={this.state.sendScreenshot}
                onChange={this.changeSendScreenshot}
              />
            </Form.Field>
            <SuccessMessage
              icon="check"
              message={this.props.bugReportStatus.message}
            />
            <ErrorMessage
              error={this.props.bugReportStatus.error}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            type="button"
            disabled={!this.state.bugReportFormValid || this.props.bugReportStatus.loading}
            onClick={this.onSubmit}
          >
            {this.props.translate('bug-report.send')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  state,
  userId: state.auth.userId,
  bugReportStatus: state.bugReport.bugReportStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (bugReport) => {
    dispatch(actionCreators.sendBugReport(bugReport));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BugReport);
