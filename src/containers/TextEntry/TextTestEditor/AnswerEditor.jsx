import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';

export class AnswerEditor extends Component {
  state = {
    answerText: '',
    correct: false,
    touched: false,
    valid: false,
  }

  componentDidMount() {
    if (this.props.answer) {
      this.setAnswer(this.props.answer);
    }
    setTimeout(() => {
      this.inputRef.focus();
      const { inputRef } = this.inputRef;
      const { length } = inputRef.value;
      inputRef.setSelectionRange(length, length);
    }, 100);
  }

  setAnswer(answer) {
    this.setState({
      answerText: answer.answerText,
      correct: answer.correct,
      valid: true,
    });
  }

  addAnswerHandler = (event, data) => {
    const answer = {
      questionId: this.props.questionId,
      answerText: this.state.answerText,
      correct: this.state.correct,
    };
    this.props.onAddAnswer(answer);
    this.props.onClose(event, data);
  }

  changeAnswerHandler = (event, data) => {
    const answer = {
      questionId: this.props.questionId,
      answerText: this.state.answerText,
      correct: this.state.correct,
    };
    this.props.onChangeAnswer(this.props.questionId, this.props.answer.id, answer);
    this.props.onClose(event, data);
  }

  answerInputChangeHandler = (event, data) => {
    this.setState({
      touched: true,
      valid: data.value.trim() !== '',
      answerText: data.value,
    });
  }

  correctChangeHandler = () => {
    this.setState({
      touched: true,
      correct: !this.state.correct,
    });
  }

  keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      if (this.props.answer) {
        this.changeAnswerHandler(event, {});
      } else {
        this.addAnswerHandler(event, {});
      }
    }
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
        closeIcon
      >
        <Modal.Header>
          {this.props.answer ?
            this.props.translate('answer-editor.modal-header-change') :
            this.props.translate('answer-editor.modal-header-new')}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            ref={(ref) => { this.inputRef = ref; }}
            value={this.state.answerText}
            onChange={this.answerInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            placeholder={this.props.answer ?
              this.props.translate('answer-editor.insert-changed-placeholder') :
              this.props.translate('answer-editor.insert-new-placeholder')}
          >
            <input />
            <Button
              basic
              compact
              onClick={this.correctChangeHandler}
              icon={<Icon fitted name="check" color={this.state.correct ? 'green' : 'grey'} />}
            />
          </Input>
        </Modal.Content>
        <Modal.Actions>
          {this.props.answer ?
            <Button
              primary
              disabled={!this.state.touched || !this.state.valid}
              content={this.props.translate('answer-editor.change-answer')}
              onClick={this.changeAnswerHandler}
            /> :
            <Button
              positive
              disabled={!this.state.touched || !this.state.valid}
              content={this.props.translate('answer-editor.add-answer')}
              onClick={this.addAnswerHandler}
            />
          }
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.test.questions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onAddAnswer: (answer) => {
    dispatch(actionCreators.addAnswer(answer));
  },
  onChangeAnswer: (questionId, answerId, answer) => {
    dispatch(actionCreators.changeAnswer(questionId, answerId, answer));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AnswerEditor);
