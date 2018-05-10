import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Icon, Grid } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { stopPropagation } from '../../../shared/utility';
import QuestionEditor from './QuestionEditor';
import AnswerEditor from './AnswerEditor';
import SuccessMessage from '../../Message/SuccessMessage';
import ErrorMessage from '../../Message/ErrorMessage';

export class TextTestEditor extends Component {
  state = {
    questionEditorOpened: false,
    answerEditorOpened: false,
    selectedQuestion: null,
    selectedAnswer: null,
    removedQuestionId: null,
    removedAnswerId: null,
  }

  componentDidMount() {
    this.props.onFetchQuestions(this.props.readingTextId);
  }

  onSubmit = () => {
    this.props.onClose();
  }

  removeQuestionHandler = (questionId) => {
    this.setState({ removedQuestionId: questionId });
    this.props.onRemoveQuestion(questionId, this.props.token);
  }

  removeAnswerHandler = (questionId, answerId) => {
    this.setState({ removedAnswerId: answerId });
    this.props.onRemoveAnswer(questionId, answerId, this.props.token);
  }

  questionEditorToggleHandler = (event, data) => {
    stopPropagation(event);
    this.setState({
      questionEditorOpened: !this.state.questionEditorOpened,
      selectedQuestion: data && data.question ? data.question : null,
    });
  }

  answerEditorToggleHandler = (event, data) => {
    stopPropagation(event);
    this.setState({
      answerEditorOpened: !this.state.answerEditorOpened,
      selectedQuestion: data && data.question ? data.question : null,
      selectedAnswer: data && data.answer ? data.answer : null,
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
                      loading={question.id === this.state.removedQuestionId && this.props.questionStatus.loading}
                      disabled={question.id === this.state.removedQuestionId && this.props.questionStatus.loading}
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
                      minHeight: '2rem',
                      background: 'whitesmoke',
                    }}
                  >
                    <Grid.Column mobile={1} tablet={1} computer={1} textAlign="center">
                      {answer.correct ?
                        <Icon
                          fitted
                          name="check"
                          size="large"
                          color={answer.correct ? 'green' : 'grey'}
                        /> : null}
                    </Grid.Column>
                    <Grid.Column mobile={14} tablet={10} computer={11}>
                      {`${String.fromCharCode(65 + answerIndex)} ) ${answer.answerText}`}
                    </Grid.Column>
                    <Grid.Column floated="right" mobile={16} tablet={5} computer={3}>
                      <Button
                        negative
                        compact
                        icon="close"
                        floated="right"
                        loading={answer.id === this.state.removedAnswerId && this.props.answerStatus.loading}
                        disabled={answer.id === this.state.removedAnswerId && this.props.answerStatus.loading}
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
        <SuccessMessage
          icon="check"
          style={{ margin: '0 0' }}
          message={this.props.questionStatus.message !== null ? this.props.questionStatus.message : this.props.answerStatus.message}
        />
        <ErrorMessage
          style={{ margin: '0 0' }}
          error={this.props.questionStatus.error !== null ? this.props.questionStatus.error : this.props.answerStatus.error}
        />
        <Modal.Actions>
          <Button
            positive
            content={this.props.translate('text-test-editor.add-question')}
            onClick={this.questionEditorToggleHandler}
          />
          <Button
            primary
            content={this.props.translate('text-test-editor.ok')}
            onClick={this.onSubmit}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  questions: state.test.questions,
  questionStatus: state.test.questionStatus,
  answerStatus: state.test.answerStatus,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchQuestions: (readingTextId) => {
    dispatch(actionCreators.fetchTestEditorQuestions(readingTextId));
  },
  onRemoveQuestion: (questionId, token) => {
    dispatch(actionCreators.removeQuestion(questionId, token));
  },
  onRemoveAnswer: (questionId, answerId, token) => {
    dispatch(actionCreators.removeAnswer(questionId, answerId, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextTestEditor);
