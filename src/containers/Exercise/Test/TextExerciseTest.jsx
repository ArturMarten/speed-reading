import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Grid, Pagination, List } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';

export class TextExerciseTest extends Component {
  state = {
    questionIndex: 0,
    answers: [],
  };

  componentDidMount() {
    this.props.onTestPrepare(this.props.selectedText.id);
  }

  onQuestionChange = (event, data) => {
    this.setState({ questionIndex: data.activePage - 1 });
  }

  onAnswerChange = (questionIndex, answerId) => {
    const updatedAnswers = this.state.answers.slice();
    updatedAnswers[questionIndex] = answerId;
    this.setState({ answers: updatedAnswers });
  }

  onTestStartHandler = () => {
    const attemptData = {
      exerciseAttemptId: this.props.exerciseAttemptId,
      startTime: new Date(),
    };
    this.props.onTestStart(attemptData, this.props.token);
  }

  onTestFinishHandler = () => {
    const answers = this.props.questions.map((question, index) => ({
      testAttemptId: this.props.attemptId,
      questionId: question.id,
      answerId: this.state.answers[index] ? this.state.answers[index] : null,
    }));
    this.props.onTestFinish(this.props.attemptId, answers, this.props.token);
  }

  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2" content={this.props.translate('text-exercise-test.title')} />
        {this.props.testStatus === 'started' || this.props.testStatus === 'finishing' || this.props.testStatus === 'finished' ?
          <Grid>
            <Grid.Row centered>
              <Header as="h4" content={this.props.questions[this.state.questionIndex].questionText} />
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column mobile={16} computer={12}>
                <List selection ordered animated verticalAlign="middle">
                  {this.props.questions[this.state.questionIndex].answers.map(answer => (
                    <List.Item
                      key={answer.id}
                      active={this.state.answers[this.state.questionIndex] === answer.id}
                      onClick={() => this.onAnswerChange(this.state.questionIndex, answer.id)}
                    >
                      <List.Content>
                        <List.Description>
                          {answer.answerText}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Pagination
                ariaLabel="Questions"
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                nextItem={{
                  ariaLabel: this.props.translate('text-exercise-test.next-question'),
                  content: this.props.translate('text-exercise-test.next-question'),
                }}
                prevItem={{
                  ariaLabel: this.props.translate('text-exercise-test.previous-question'),
                  content: this.props.translate('text-exercise-test.previous-question'),
                }}
                boundaryRange={1}
                siblingRange={1}
                ellipsisItem="..."
                onPageChange={this.onQuestionChange}
                totalPages={this.props.questions.length}
              />
            </Grid.Row>
          </Grid> : <p>{this.props.translate('text-exercise-test.description')}</p>}
        {this.props.testStatus === 'started' || this.props.testStatus === 'finishing' || this.props.testStatus === 'finished' ?
          <Button
            negative
            onClick={this.onTestFinishHandler}
            floated="right"
            loading={this.props.testStatus === 'finishing'}
            disabled={this.props.testStatus === 'finishing' || this.props.testStatus === 'finished'}
          >{this.props.translate('text-exercise-test.finish-test')}
          </Button> :
          <Button
            positive
            onClick={this.onTestStartHandler}
            floated="right"
            loading={this.props.testStatus === 'preparing' || this.props.testStatus === 'starting'}
            disabled={this.props.testStatus === 'preparing' || this.props.testStatus === 'starting'}
          >{this.props.translate('text-exercise-test.start-test')}
          </Button>}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  exerciseAttemptId: state.exercise.attemptId,
  attemptId: state.test.attemptId,
  selectedText: state.text.selectedText,
  questions: state.test.questions,
  testStatus: state.test.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onTestPrepare: (readingTextId) => {
    dispatch(actionCreators.prepareTest(readingTextId));
  },
  onTestStart: (attemptData, token) => {
    dispatch(actionCreators.startTest(attemptData, token));
  },
  onTestFinish: (attemptId, answers, token) => {
    dispatch(actionCreators.finishTest(attemptId, answers, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseTest);
