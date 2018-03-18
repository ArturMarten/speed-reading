import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Icon, Grid } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { stopPropagation } from '../../../shared/utility';
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

  removeAnswerHandler = (questionId, answerId) => {
    this.props.onRemoveAnswer(questionId, answerId);
  }

  questionEditorToggleHandler = (event, data) => {
    stopPropagation(event);
    this.setState({
      questionEditorOpened: !this.state.questionEditorOpened,
      selectedQuestion: data.question ? data.question : null,
    });
  }

  answerEditorToggleHandler = (event, data) => {
    stopPropagation(event);
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
        <Modal.Content scrolling style={{ height: '65vh', maxHeight: '65vh' }}>
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
          <Grid verticalAlign="middle">
            {this.props.questions.map((question, questionIndex) => (
              <Fragment key={question.id}>
                <Grid.Row
                  style={{
                    paddingTop: '0',
                    paddingBottom: '0',
                    marginTop: '0.2rem',
                    marginBottom: '0.2rem',
                    background: 'whitesmoke',
                  }}
                >
                  <Grid.Column mobile={16} tablet={12} computer={13}>
                    {`${questionIndex + 1}. ${question.questionText}`}
                  </Grid.Column>
                  <Grid.Column floated="right" mobile={16} tablet={4} computer={3}>
                    <Button
                      compact
                      negative
                      floated="right"
                      icon="close"
                      onClick={() => this.removeQuestionHandler(question.id)}
                    />
                    <Button
                      compact
                      primary
                      content={this.props.translate('text-test-editor.change')}
                      floated="right"
                      onClick={event => this.questionEditorToggleHandler(event, { question })}
                    />
                  </Grid.Column>
                </Grid.Row>
                {this.props.questions[questionIndex].answers.map((answer, answerIndex) => (
                  <Grid.Row
                    key={answer.id}
                    style={{
                      paddingTop: '0',
                      paddingBottom: '0',
                      marginTop: '0.2rem',
                      marginBottom: '0.2rem',
                      background: 'whitesmoke',
                    }}
                  >
                    <Grid.Column mobile={1} tablet={1} computer={1} textAlign="center">
                      <Icon
                        fitted
                        name="check"
                        size="large"
                        color={answer.correct ? 'green' : 'grey'}
                      />
                    </Grid.Column>
                    <Grid.Column mobile={14} tablet={10} computer={11}>
                      {`${answerIndex + 1}. ${answer.answerText}`}
                    </Grid.Column>
                    <Grid.Column floated="right" mobile={16} tablet={5} computer={3}>
                      <Button
                        negative
                        compact
                        icon="close"
                        floated="right"
                        onClick={() => this.removeAnswerHandler(question.id, answer.id)}
                      />
                      <Button
                        primary
                        compact
                        content={this.props.translate('text-test-editor.change')}
                        floated="right"
                        onClick={event => this.answerEditorToggleHandler(event, { question, answer })}
                      />
                    </Grid.Column>
                  </Grid.Row>
                ))}
                <Grid.Row
                  style={{
                    paddingTop: '0.2rem',
                    paddingBottom: '0.2rem',
                  }}
                >
                  <Grid.Column floated="right" width={16}>
                    <Button
                      positive
                      compact
                      floated="right"
                      onClick={event => this.answerEditorToggleHandler(event, { question })}
                      content={this.props.translate('text-test-editor.add-answer')}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Fragment>
            ))}
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content={this.props.translate('text-test-editor.add-question')}
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
  onRemoveAnswer: (questionId, answerId) => {
    dispatch(actionCreators.removeAnswer(questionId, answerId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextTestEditor);
