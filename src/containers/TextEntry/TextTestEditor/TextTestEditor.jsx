import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, Icon, List } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import QuestionEditor from './QuestionEditor';
import AnswerEditor from './AnswerEditor';

export class TextTestEditor extends Component {
  state = {
    questionEditorOpened: false,
    answerEditorOpened: false,
    selectedQuestion: null,
    selectedAnswer: null,
  }

  componentDidMount() {
    this.props.onFetchQuestions(this.props.readingTextId);
  }

  onSubmit = () => {
    this.props.onClose();
  }

  removeQuestionHandler = (questionId) => {
    this.props.onRemoveQuestion(questionId);
  }

  questionEditorToggleHandler = (event, data) => {
    if (event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }
    this.setState({
      questionEditorOpened: !this.state.questionEditorOpened,
      selectedQuestion: data.question ? data.question : null,
    });
  }

  answerEditorToggleHandler = (event, data) => {
    if (event.nativeEvent) {
      event.nativeEvent.stopImmediatePropagation();
    }
    this.setState({
      answerEditorOpened: !this.state.answerEditorOpened,
      selectedQuestion: data.question ? data.question : null,
      selectedAnswer: data.answer ? data.answer : null,
    });
  }

  render() {
    return (
      <Modal size="large" open={this.props.open} onClose={this.props.onClose} closeIcon>
        <Modal.Header>{this.props.translate('text-test-editor.modal-header')}</Modal.Header>
        <Modal.Content scrolling>
          {this.state.questionEditorOpened ?
            <QuestionEditor
              open={this.state.questionEditorOpened}
              onClose={this.questionEditorToggleHandler}
              readingTextId={this.props.readingTextId}
              question={this.state.selectedQuestion}
            /> : null}
          {this.state.answerEditorOpened ?
            <AnswerEditor
              open={this.state.answerEditorOpened}
              onClose={this.answerEditorToggleHandler}
              questionId={this.state.selectedQuestion ? this.state.selectedQuestion.id : null}
              answer={this.state.selectedAnswer}
            /> : null}
          <List>
            {this.props.questions.map((question, questionIndex) => (
              <List.Item key={question.id}>
                <List.Content floated="left" verticalAlign="middle">
                  {`${questionIndex + 1}. ${question.questionText}`}
                </List.Content>
                <List.Content floated="right">
                  <Button
                    compact
                    primary
                    content="Change"
                    onClick={event => this.questionEditorToggleHandler(event, { question })}
                  />
                  <Button
                    compact
                    negative
                    icon="close"
                    onClick={() => this.removeQuestionHandler(question.id)}
                  />
                </List.Content>
                <List.List>
                  {this.props.questions[questionIndex].answers.map((answer, answerIndex) => (
                    <List.Item key={answer.id}>
                      <List.Content floated="left" verticalAlign="middle">
                        {`${answerIndex + 1}. ${answer.answerText}`}
                      </List.Content>
                      <List.Content floated="right">
                        <Button
                          compact
                          icon={<Icon fitted name="check" color={answer.correct ? 'green' : 'grey'} />}
                        />
                        <Button
                          primary
                          compact
                          content="Change"
                          onClick={event => this.answerEditorToggleHandler(event, { question, answer })}
                        />
                        <Button
                          negative
                          compact
                          icon="close"
                        />
                      </List.Content>
                    </List.Item>
                  ))}
                  <List.Item key="newAnswer">
                    <List.Content content="" />
                    <List.Content floated="right">
                      <Button
                        positive
                        compact
                        onClick={event => this.answerEditorToggleHandler(event, { question })}
                        content="Add answer"
                      />
                    </List.Content>
                  </List.Item>
                </List.List>
              </List.Item>
            ))}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content="Add question"
            disabled={this.props.error !== null}
            onClick={this.questionEditorToggleHandler}
          />
          <Button
            primary
            content={this.props.translate('text-test-editor.ok')}
            disabled={this.props.error !== null}
            onClick={this.onSubmit}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.test.questions,
  error: state.test.error,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchQuestions: (readingTextId) => {
    dispatch(actionCreators.fetchQuestions(readingTextId));
  },
  onRemoveQuestion: (questionId) => {
    dispatch(actionCreators.removeQuestion(questionId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextTestEditor);
