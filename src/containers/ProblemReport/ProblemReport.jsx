import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Button, Dropdown, TextArea, Input, Image, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';
import html2canvas from 'html2canvas';

import * as actionCreators from '../../store/actions';
import { checkValidity, stopPropagation } from '../../shared/utility';
import ErrorMessage from '../Message/ErrorMessage';
import SuccessMessage from '../Message/SuccessMessage';

const initialState = {
  problemType: 'text',
  problemReportForm: {
    textTitle: {
      value: '',
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
    description: {
      value: '',
      validation: {
        required: false,
      },
      valid: true,
      touched: false,
    },
  },
  problemReportFormValid: false,
  sendTextTitle: true,
  sendScreenshot: true,
  screenshotImage: null,
  screenshotOpen: false,
};

export class ProblemReport extends Component {
  state = { ...initialState };

  componentDidMount() {
    html2canvas(document.querySelector('#root'), { logging: false }).then((canvas) => {
      this.setState({
        screenshotImage: canvas.toDataURL('image/png'),
      });
    });
    if (this.props.selectedText !== null) {
      this.selectDefaultText();
    }
  }

  problemTypeChangeHandler = (event, { value }) => {
    this.setState({
      problemType: value,
    });
  }

  selectDefaultText = () => {
    const updatedProblemReportForm = { ...this.state.problemReportForm };
    const updatedFormElement = { ...updatedProblemReportForm.textTitle };
    updatedFormElement.value = this.props.selectedText.title;
    updatedFormElement.valid = true;
    updatedProblemReportForm.textTitle = updatedFormElement;
    this.setState({
      problemReportForm: updatedProblemReportForm,
    });
  }

  onSubmit = () => {
    const submittedForm = {
      userId: this.props.userId,
      type: this.state.problemType,
      textTitle: this.state.problemType === 'text' && this.state.problemReportForm.textTitle.value !== '' ?
        this.state.problemReportForm.textTitle.value : null,
      description: this.state.problemReportForm.description.value,
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
    const updatedProblemReportForm = { ...this.state.problemReportForm };
    const updatedFormElement = { ...updatedProblemReportForm[name] };
    updatedFormElement.value = value;
    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedProblemReportForm[name] = updatedFormElement;
    let formIsValid = true;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const inputName in updatedProblemReportForm) {
      formIsValid = updatedProblemReportForm[inputName].valid && formIsValid;
    }
    this.setState({
      problemReportForm: updatedProblemReportForm,
      problemReportFormValid: formIsValid,
    });
  }

  changeSendScreenshot = () => {
    this.setState({ sendScreenshot: !this.state.sendScreenshot });
  }

  render() {
    const problemTypeOptions = [
      { key: 'text', text: this.props.translate('problem-report.type-text'), value: 'text' },
      { key: 'other', text: this.props.translate('problem-report.type-other'), value: 'other' },
    ];
    const screenshotModal = (
      <Modal open={this.state.screenshotOpen} closeOnDimmerClick={false} onClose={this.openScreenshotToggle} closeIcon>
        <Image
          bordered
          centered
          size="huge"
          src={this.state.screenshotImage}
          alt={this.props.translate('problem-report.screenshot-alt')}
        />
      </Modal>
    );
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>
          {this.props.translate('problem-report.modal-header')}
        </Modal.Header>
        <Modal.Content>
          {screenshotModal}
          <Form
            loading={this.props.problemReportStatus.loading}
            success={this.props.problemReportStatus.message !== null}
            error={this.props.problemReportStatus.error !== null}
          >
            <Form.Field error={!this.state.problemReportForm.textTitle.valid && this.state.problemReportForm.textTitle.touched}>
              <label htmlFor="problem-report-type">
                {this.props.translate('problem-report.select-type')}
              </label>
              <Dropdown
                id="problem-report-type"
                fluid
                selection
                value={this.state.problemType}
                onChange={this.problemTypeChangeHandler}
                options={problemTypeOptions}
              />
            </Form.Field>
            {this.state.problemType === 'text' ?
              <Form.Field error={!this.state.problemReportForm.textTitle.valid && this.state.problemReportForm.textTitle.touched}>
                <label htmlFor="problem-report-text">
                  {this.props.translate('problem-report.input-text-title')}
                </label>
                <Input
                  id="problem-report-text"
                  name="textTitle"
                  placeholder={this.props.translate('problem-report.input-text-title-placeholder')}
                  value={this.state.problemReportForm.textTitle.value}
                  onChange={this.inputChangeHandler}
                />
              </Form.Field> : null}
            <Form.Field error={!this.state.problemReportForm.description.valid && this.state.problemReportForm.description.touched}>
              <label htmlFor="problem-report-description">
                {this.props.translate('problem-report.textarea-description')}
              </label>
              <TextArea
                id="problem-report-description"
                name="description"
                autoHeight
                rows={6}
                placeholder={this.props.translate('problem-report.textarea-placeholder')}
                value={this.state.problemReportForm.description.value}
                onChange={this.inputChangeHandler}
              />
            </Form.Field>
            <Form.Field inline>
              <Image
                inline
                bordered
                src={this.state.screenshotImage}
                size="small"
                onClick={this.openScreenshotToggle}
                alt={this.props.translate('problem-report.screenshot-alt')}
              />
              <Checkbox
                label={this.props.translate('problem-report.send-screenshot')}
                checked={this.state.sendScreenshot}
                onChange={this.changeSendScreenshot}
              />
            </Form.Field>
            <SuccessMessage
              icon="check"
              message={this.props.problemReportStatus.message}
            />
            <ErrorMessage
              error={this.props.problemReportStatus.error}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            type="button"
            disabled={!this.state.problemReportFormValid || this.props.problemReportStatus.loading}
            onClick={this.onSubmit}
          >
            {this.props.translate('problem-report.send')}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  state,
  userId: state.auth.userId,
  selectedText: state.text.selectedText,
  problemReportStatus: state.problemReport.problemReportStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (problemReport) => {
    dispatch(actionCreators.sendProblemReport(problemReport));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProblemReport);
