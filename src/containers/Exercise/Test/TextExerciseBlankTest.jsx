import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Grid, Pagination, Input, Confirm } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import { focusInput } from '../../../shared/utility';

export class TextExerciseBlankTest extends Component {
  state = {
    blankExerciseIndex: 0,
    answers: [],
    confirm: false,
  };

  componentDidMount() {
    this.props.onTestPrepare(this.props.selectedText.plainText);
  }

  onBlankChange = (event, data) => {
    this.setState({ blankExerciseIndex: data.activePage - 1 });
    focusInput(this.inputRef);
  };

  onInputChangeHandler = (blankExerciseIndex) => (event) => {
    const newValue = event.target.value;
    const updatedAnswers = this.state.answers.slice();
    updatedAnswers[blankExerciseIndex] = newValue;
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
    return this.props.blankExercises
      .map((blankExericise, index) => (this.state.answers[index] ? this.state.answers[index] : null))
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
    const answers = this.props.blankExercises.map((blankExercise, index) => ({
      testAttemptId: this.props.attemptId,
      language: 'estonian',
      blankExercise: blankExercise.blankExercise,
      correct: blankExercise.correct,
      answer: this.state.answers[index] ? this.state.answers[index] : null,
    }));
    this.props.onTestFinish(this.props.attemptId, answers);
  };

  render() {
    const unansweredCount = this.getUnansweredCount();
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2" content={this.props.translate('text-exercise-blank-test.title')} />
        {this.props.testStatus === 'started' ||
        this.props.testStatus === 'finishing' ||
        this.props.testStatus === 'finished' ? (
          <Grid container style={{ paddingTop: '10px' }}>
            <Grid.Row columns={1} style={{ paddingTop: '5em', paddingBottom: '10em' }}>
              <Grid.Column textAlign="center">
                <Header as="h3">
                  {`${this.state.blankExerciseIndex + 1}. ${
                    this.props.blankExercises[this.state.blankExerciseIndex].blankExercise[0]
                  }`}
                  <Input
                    focus
                    autoFocus
                    type="text"
                    transparent
                    ref={(ref) => {
                      this.inputRef = ref;
                    }}
                    placeholder={this.props.translate('text-exercise-blank-test.blank-placeholder')}
                  >
                    <input
                      style={{ textAlign: 'center', fontWeight: 'bold', color: 'rgb(0, 76, 255)' }}
                      size={this.props.blankExercises[this.state.blankExerciseIndex].correct.length}
                      value={
                        this.state.answers[this.state.blankExerciseIndex] === undefined
                          ? ''
                          : this.state.answers[this.state.blankExerciseIndex]
                      }
                      onChange={this.onInputChangeHandler(this.state.blankExerciseIndex)}
                    />
                  </Input>
                  {this.props.blankExercises[this.state.blankExerciseIndex].blankExercise[2]}
                </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Pagination
                defaultActivePage={1}
                firstItem={null}
                lastItem={null}
                nextItem={{
                  content: this.props.translate('text-exercise-blank-test.next-blank'),
                }}
                prevItem={{
                  content: this.props.translate('text-exercise-blank-test.previous-blank'),
                }}
                boundaryRange={1}
                siblingRange={1}
                ellipsisItem="..."
                onPageChange={this.onBlankChange}
                totalPages={this.props.blankExercises.length}
              />
            </Grid.Row>
          </Grid>
        ) : (
          <p>{this.props.translate('text-exercise-blank-test.description')}</p>
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
            {this.props.translate('text-exercise-blank-test.finish-test')}
          </Button>
        ) : (
          <Button
            positive
            onClick={this.onTestStartHandler}
            floated="right"
            loading={this.props.testStatus === 'preparing' || this.props.testStatus === 'starting'}
            disabled={
              this.props.testStatus === 'preparation' ||
              this.props.testStatus === 'preparing' ||
              this.props.testStatus === 'starting'
            }
          >
            {this.props.translate('text-exercise-blank-test.start-test')}
          </Button>
        )}
        <Confirm
          open={this.state.confirm}
          content={`${unansweredCount} ${this.props.translate('text-exercise-blank-test.confirm')}`}
          cancelButton={this.props.translate('text-exercise-blank-test.back')}
          confirmButton={this.props.translate('text-exercise-blank-test.finish-test')}
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
  blankExercises: state.exerciseTest.blankExercises,
  testStatus: state.exerciseTest.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onTestPrepare: (readingText) => {
    dispatch(actionCreators.prepareBlankTest(readingText));
  },
  onTestStart: (attemptData) => {
    dispatch(actionCreators.startTest(attemptData));
  },
  onTestFinish: (attemptId, answers) => {
    dispatch(actionCreators.finishBlankTest(attemptId, answers));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseBlankTest);
