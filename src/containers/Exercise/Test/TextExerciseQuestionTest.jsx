import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Grid, Pagination, List, Confirm } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import './TextExerciseQuestionTest.css';
import * as actionCreators from '../../../store/actions';

export class TextExerciseQuestionTest extends Component {
  state = {
    questionIndex: 0,
    answers: [],
    confirm: false,
  };

  componentDidMount() {
    this.props.onTestPrepare(this.props.selectedText.id);
  }

  onQuestionChange = (event, data) => {
    this.setState({ questionIndex: data.activePage - 1 });
  };

  onAnswerChange = (questionIndex, answerId) => {
    const updatedAnswers = this.state.answers.slice();
    updatedAnswers[questionIndex] = answerId;
    this.setState({ answers: updatedAnswers });
  };

  onTestStartHandler = () => {
    const attemptData = {
      exerciseAttemptId: this.props.exerciseAttemptId,
      startTime: new Date(),
    };
    this.props.onTestStart(attemptData);
  };

  getUnansweredCount = () => {
    return this.props.questions
      .map((question, index) => (this.state.answers[index] ? this.state.answers[index] : null))
      .filter((answer) => answer === null).length;
  };

  onTestFinishingHandler = () => {
    const unansweredCount = this.getUnansweredCount();
    if (unansweredCount > 0) {
      this.setState({ confirm: true });
    } else {
      this.onTestFinishHandler();
    }
  };

  onConfirmCancel = () => {
    this.setState({ confirm: false });
  };

  onTestFinishHandler = () => {
    this.setState({ confirm: false });
    const answers = this.props.questions.map((question, index) => ({
      testAttemptId: this.props.attemptId,
      questionId: question.id,
      answerId: this.state.answers[index] ? this.state.answers[index] : null,
    }));
    this.props.onTestFinish(this.props.attemptId, answers);
  };

  render() {
    const unansweredCount = this.getUnansweredCount();
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2" content={this.props.translate('text-exercise-question-test.title')} />
        {this.props.testStatus === 'started' ||
        this.props.testStatus === 'finishing' ||
        this.props.testStatus === 'finished' ? (
          <Grid container style={{ paddingTop: '10px' }}>
            <Grid.Row columns={1} style={{ paddingBottom: '2px' }}>
              <Grid.Column>
                <Header as="h4">
                  {`${this.state.questionIndex + 1}. ${this.props.questions[this.state.questionIndex].questionText}`}
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingTop: '2px' }}>
              <Grid.Column>
                <List selection animated verticalAlign="middle">
                  {this.props.questions[this.state.questionIndex].answers.map((answer, answerIndex) => (
                    <List.Item
                      id="question-answer"
                      key={answer.id}
                      active={this.state.answers[this.state.questionIndex] === answer.id}
                      onClick={() => this.onAnswerChange(this.state.questionIndex, answer.id)}
                    >
                      <List.Content>
                        <List.Description id="question-answer-text">
                          {`${String.fromCharCode(65 + answerIndex)} ) ${answer.answerText}`}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                nextItem={{
                  content: this.props.translate('text-exercise-question-test.next-question'),
                }}
                prevItem={{
                  content: this.props.translate('text-exercise-question-test.previous-question'),
                }}
                boundaryRange={1}
                siblingRange={1}
                ellipsisItem="..."
                onPageChange={this.onQuestionChange}
                totalPages={this.props.questions.length}
              />
            </Grid.Row>
          </Grid>
        ) : (
          <p>{this.props.translate('text-exercise-question-test.description')}</p>
        )}
        {this.props.testStatus === 'started' ||
        this.props.testStatus === 'finishing' ||
        this.props.testStatus === 'finished' ? (
          <Button
            negative
            onClick={this.onTestFinishingHandler}
            floated="right"
            style={{ marginTop: '15px' }}
            loading={this.props.testStatus === 'finishing'}
            disabled={this.props.testStatus === 'finishing' || this.props.testStatus === 'finished'}
          >
            {this.props.translate('text-exercise-question-test.finish-test')}
          </Button>
        ) : (
          <Button
            positive
            onClick={this.onTestStartHandler}
            floated="right"
            loading={this.props.testStatus === 'preparing' || this.props.testStatus === 'starting'}
            disabled={this.props.testStatus === 'preparing' || this.props.testStatus === 'starting'}
          >
            {this.props.translate('text-exercise-question-test.start-test')}
          </Button>
        )}
        <Confirm
          open={this.state.confirm}
          content={`${unansweredCount} ${this.props.translate('text-exercise-question-test.confirm')}`}
          cancelButton={this.props.translate('text-exercise-question-test.back')}
          confirmButton={this.props.translate('text-exercise-question-test.finish-test')}
          onCancel={this.onConfirmCancel}
          onConfirm={this.onTestFinishHandler}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  exerciseAttemptId: state.exercise.attemptId,
  attemptId: state.exerciseTest.attemptId,
  selectedText: state.text.selectedText,
  questions: state.exerciseTest.questions,
  testStatus: state.exerciseTest.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onTestPrepare: (readingTextId) => {
    dispatch(actionCreators.prepareQuestionTest(readingTextId));
  },
  onTestStart: (attemptData) => {
    dispatch(actionCreators.startTest(attemptData));
  },
  onTestFinish: (attemptId, answers) => {
    dispatch(actionCreators.finishQuestionTest(attemptId, answers));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseQuestionTest);
