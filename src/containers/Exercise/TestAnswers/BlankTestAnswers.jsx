import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Grid, Loader, Segment, Dropdown } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';
import * as api from '../../../api';
import * as actionCreators from '../../../store/actions';

export class BlankTestAnswers extends Component {
  state = {
    loading: true,
    testBlankAnswers: [],
    answerCategoryOptions: [
      { key: 0, value: 'unanswered', text: this.props.translate('blank-test-answers.unanswered'), disabled: true },
      { key: 1, value: 'correct', text: this.props.translate('blank-test-answers.correct'), disabled: true },
      { key: 2, value: 'incorrect', text: this.props.translate('blank-test-answers.incorrect') },
      { key: 3, value: 'misspelled', text: this.props.translate('blank-test-answers.misspelled') },
      { key: 4, value: 'synonym', text: this.props.translate('blank-test-answers.synonym') },
    ],
  };

  componentDidMount() {
    api.fetchTestBlankAnswers(this.props.testAttemptId).then(
      (testBlankAnswers) => {
        this.setState({
          loading: false,
          testBlankAnswers,
        });
      },
      () => {
        this.setState({
          loading: false,
          testBlankAnswers: [],
        });
      },
    );
  }

  answerCategoryChangeHandler = (blankAnswerId, userEvaluation) => {
    api.changeTestBlankAnswer({ blankAnswerId, userEvaluation }).then(
      () => {
        this.setState({
          testBlankAnswers: this.state.testBlankAnswers.map((testBlankAnswer) => ({
            ...testBlankAnswer,
            userEvaluation: testBlankAnswer.id === blankAnswerId ? userEvaluation : testBlankAnswer.userEvaluation,
          })),
        });
        this.props.reevaluateTestAttempt(this.props.testAttemptId);
      },
      (errorMessage) => {
        console.log(errorMessage);
      },
    );
  };

  render() {
    return (
      <Container style={{ marginTop: '3vh', marginBottom: '10vh' }}>
        <Header as="h2">{this.props.translate('blank-test-answers.header')}</Header>
        <Grid stackable style={{ fontSize: '1.2em' }}>
          <Grid.Row columns="equal">
            <Grid.Column textAlign="center">
              {`${this.props.translate('test-results.test-result')}: ${Math.round(
                this.props.result.testResult * 100,
              )}%`}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {`${this.props.translate('test-results.comprehension-level')}: ${Math.round(
                this.props.result.comprehensionResult * 100,
              )}%`}
            </Grid.Column>
            <Grid.Column textAlign="center">
              {`${this.props.translate('test-results.comprehension-speed')}: ${Math.round(
                this.props.result.comprehensionPerMinute,
              )}`}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.loading ? (
          <Segment basic style={{ minHeight: '15vh' }}>
            <Loader active indeterminate content={this.props.translate('blank-test-answers.loading')} />
          </Segment>
        ) : (
          this.state.testBlankAnswers.map((testBlankAnswer, testBlankAnswerIndex) => (
            <Segment clearing key={testBlankAnswer.id}>
              <Header as="h3">
                {`${testBlankAnswerIndex + 1}. ${testBlankAnswer.blankExercise[0]} `}

                {testBlankAnswer.autoEvaluation === 'unanswered' ? (
                  <span style={{ color: 'rgb(204, 0, 0)' }}>...</span>
                ) : null}
                {(testBlankAnswer.autoEvaluation === 'incorrect' && !testBlankAnswer.userEvaluation) ||
                testBlankAnswer.userEvaluation === 'incorrect' ? (
                  <span style={{ color: 'rgb(204, 0, 0)', textDecoration: 'line-through' }}>
                    {testBlankAnswer.answer}
                  </span>
                ) : null}
                {(testBlankAnswer.autoEvaluation === 'misspelled' && !testBlankAnswer.userEvaluation) ||
                testBlankAnswer.userEvaluation === 'misspelled' ? (
                  <span
                    style={{
                      color: 'rgb(20, 122, 195)',
                      textDecoration: 'underline',
                      textDecorationColor: 'rgb(204, 0, 0)',
                      textDecorationStyle: 'wavy',
                    }}
                  >
                    {`${testBlankAnswer.answer}`}
                  </span>
                ) : null}
                {(testBlankAnswer.autoEvaluation === 'synonym' && !testBlankAnswer.userEvaluation) ||
                testBlankAnswer.userEvaluation === 'synonym' ? (
                  <span style={{ color: 'rgb(20, 122, 195)' }}>{`${testBlankAnswer.answer}`}</span>
                ) : null}
                {testBlankAnswer.autoEvaluation !== 'correct' ? (
                  <span>{` (${this.props.translate('blank-test-answers.correct-answer')}: `}</span>
                ) : null}
                <span style={{ color: 'rgb(0, 128, 0)' }}>{testBlankAnswer.correct}</span>
                {testBlankAnswer.autoEvaluation !== 'correct' ? <span>{')'}</span> : null}
                {` ${testBlankAnswer.blankExercise[2]}`}
              </Header>
              <Dropdown
                selection
                value={testBlankAnswer.userEvaluation || testBlankAnswer.autoEvaluation}
                disabled={
                  testBlankAnswer.autoEvaluation === 'unanswered' || testBlankAnswer.autoEvaluation === 'correct'
                }
                onChange={(event, { value }) => this.answerCategoryChangeHandler(testBlankAnswer.id, value)}
                options={this.state.answerCategoryOptions}
                style={{ float: 'right' }}
              />
            </Segment>
          ))
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.exerciseTest.result,
  testAttemptId: state.exerciseTest.attemptId,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  reevaluateTestAttempt: (testAttemptId) => {
    dispatch(actionCreators.reevaluateTestAttempt(testAttemptId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlankTestAnswers);
