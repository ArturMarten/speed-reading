import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Dropdown, Button, Input } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';

const questionOptions = [
  { key: 'question', text: 'Question', value: 'question' },
  { key: 'blank', text: 'Blank', value: 'blank' },
];

class QuestionEditor extends Component {
  state = {
    questionText: '',
    category: 'question',
    touched: false,
    valid: false,
  }

  componentDidMount() {
    if (this.props.question) {
      this.setQuestion(this.props.question);
    }
  }

  setQuestion(question) {
    this.setState({
      questionText: question.questionText,
      category: question.category,
      valid: true,
    });
  }

  addQuestionHandler = (event, data) => {
    const question = {
      readingTextId: this.props.readingTextId,
      questionText: this.state.questionText,
      category: this.state.category,
    };
    this.props.onAddQuestion(question);
    this.props.onClose(event, data);
  }

  changeQuestionHandler = (event, data) => {
    const question = {
      readingTextId: this.props.readingTextId,
      questionText: this.state.questionText,
      category: this.state.category,
    };
    this.props.onChangeQuestion(this.props.question.id, question);
    this.props.onClose(event, data);
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
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.onClose}
        size="small"
        closeIcon
      >
        <Modal.Header>
          {this.props.question ? 'Change question' : 'New question'}
        </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            action
            value={this.state.questionText}
            onChange={this.questionInputChangeHandler}
            onKeyPress={this.keyPressHandler}
            placeholder={this.props.question ? 'Insert changed question here...' : 'Insert new question here...'}
          >
            <input />
            <Dropdown
              selection
              compact
              value={this.state.category}
              onChange={this.questionCategoryChangeHandler}
              options={questionOptions}
            />
          </Input>
        </Modal.Content>
        <Modal.Actions>
          {this.props.question ?
            <Button
              primary
              disabled={!this.state.touched || !this.state.valid}
              content="Change question"
              onClick={this.changeQuestionHandler}
            /> :
            <Button
              positive
              disabled={!this.state.touched || !this.state.valid}
              content="Add question"
              onClick={this.addQuestionHandler}
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
  onAddQuestion: (question) => {
    dispatch(actionCreators.addQuestion(question));
  },
  onChangeQuestion: (questionId, question) => {
    dispatch(actionCreators.changeQuestion(questionId, question));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditor);
