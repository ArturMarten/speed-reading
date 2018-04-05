import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Dropdown, Button, Input } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ErrorMessage from '../../Message/ErrorMessage';

export class QuestionEditor extends Component {
  state = {
    questionText: '',
    category: 'question',
    touched: false,
    valid: false,
    submitted: false,
  }

  componentDidMount() {
    if (this.props.question) {
      this.setQuestion(this.props.question);
    }
    setTimeout(() => {
      this.inputRef.focus();
      const { inputRef } = this.inputRef;
      const { length } = inputRef.value;
      inputRef.setSelectionRange(length, length);
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.questionStatus.loading && !this.props.questionStatus.loading && this.props.questionStatus.error === null) {
      this.props.onClose();
    }
  }

  setQuestion(question) {
    this.setState({
      questionText: question.questionText,
      category: question.category,
      valid: true,
    });
  }

  addQuestionHandler = () => {
    const question = {
      readingTextId: this.props.readingTextId,
      questionText: this.state.questionText,
      category: this.state.category,
    };
    this.props.onAddQuestion(question, this.props.token);
    this.setState({ submitted: true });
  }

  changeQuestionHandler = () => {
    const question = {
      readingTextId: this.props.readingTextId,
      questionText: this.state.questionText,
      category: this.state.category,
    };
    this.props.onChangeQuestion(this.props.question.id, question, this.props.token);
    this.setState({ submitted: true });
  }

  questionInputChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      valid: data.value.trim() !== '',
      questionText: data.value,
    });
  }

  questionCategoryChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      category: data.value,
    });
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.props.question) {
        this.changeQuestionHandler(event, {});
      } else {
        this.addQuestionHandler(event, {});
      }
    }
  }

  render() {
    const questionOptions = [
      { key: 'question', text: this.props.translate('question-editor.category-question'), value: 'question' },
      { key: 'blank', text: this.props.translate('question-editor.category-blank'), value: 'blank' },
    ];
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
        closeIcon
      >
        <Modal.Header>
          {this.props.question ?
            this.props.translate('question-editor.modal-header-change') :
            this.props.translate('question-editor.modal-header-new')}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            ref={(ref) => { this.inputRef = ref; }}
            value={this.state.questionText}
            onChange={this.questionInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            placeholder={this.props.question ?
              this.props.translate('question-editor.insert-changed-placeholder') :
              this.props.translate('question-editor.insert-new-placeholder')}
          >
            <input />
            <Dropdown
              selection
              value={this.state.category}
              onChange={this.questionCategoryChangeHandler}
              options={questionOptions}
            />
          </Input>
          {this.props.questionStatus.error && this.state.submitted ?
            <ErrorMessage
              error={this.props.questionStatus.error}
            /> : null}
        </Modal.Content>
        <Modal.Actions>
          {this.props.question ?
            <Button
              primary
              loading={this.props.questionStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.questionStatus.loading}
              content={this.props.translate('question-editor.change-question')}
              onClick={this.changeQuestionHandler}
            /> :
            <Button
              positive
              loading={this.props.questionStatus.loading}
              disabled={!this.state.touched || !this.state.valid || this.props.questionStatus.loading}
              content={this.props.translate('question-editor.add-question')}
              onClick={this.addQuestionHandler}
            />
          }
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  questionStatus: state.test.questionStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAddQuestion: (question, token) => {
    dispatch(actionCreators.addQuestion(question, token));
  },
  onChangeQuestion: (questionId, question, token) => {
    dispatch(actionCreators.changeQuestion(questionId, question, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditor);
