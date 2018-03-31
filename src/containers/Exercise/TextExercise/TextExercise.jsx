import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Dimmer } from 'semantic-ui-react';

import './TextExercise.css';
import * as actionCreators from '../../../store/actions';
import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import ReadingTest from '../Types/ReadingTest';
import ReadingAid from '../Types/ReadingAid';
import Disappearing from '../Types/Disappearing';
import WordGroups from '../Types/WordGroups';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

export class TextExercise extends Component {
  state = {};

  onExerciseStartHandler = () => {
    const attemptData = {
      userId: this.props.userId,
      exerciseId: this.props.exerciseId,
      startTime: new Date(),
      readingTextId: this.props.selectedText.id,
    };
    this.props.onExerciseStart(attemptData, this.props.token);
  }

  onExerciseFinishHandler = () => {
    this.props.onExerciseFinish(this.props.attemptId, this.props.token);
  }

  render() {
    const exercise = ((type) => {
      switch (type) {
        case 'readingTest':
          return (
            <ReadingTest
              selectedText={this.props.selectedText}
            />
          );
        case 'readingAid':
          return (
            <ReadingAid
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        case 'disappearing':
          return (
            <Disappearing
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        case 'wordGroups':
          return (
            <WordGroups
              wordGroups={this.props.wordGroups}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        default:
          return null;
      }
    })(this.props.type);
    return (
      <Grid container>
        <Grid.Row verticalAlign="middle">
          <Grid.Column textAlign="center" width={8}>
            <table>
              <tbody>
                <SpeedOptions
                  exerciseType={this.props.type}
                />
              </tbody>
            </table>
          </Grid.Column>
          <Grid.Column textAlign="center" width={8}>
            <Timing
              loading={this.props.exerciseStatus === 'starting' || this.props.exerciseStatus === 'finishing'}
              onStart={this.onExerciseStartHandler}
              onStop={this.onExerciseFinishHandler}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Segment compact>
            <Dimmer.Dimmable
              blurring
              dimmed={!this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped}
            >
              <div style={{
                  padding: `${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px ${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px`,
                }}
              >
                {exercise}
              </div>
            </Dimmer.Dimmable>
          </Segment>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId,
  exerciseId: state.exercise.id,
  exerciseStatus: state.exercise.status,
  attemptId: state.exercise.attemptId,
  selectedText: state.text.selectedText,
  wordGroups: state.exercise.wordGroups,
  timerState: state.timing.timer,
});

const mapDispatchToProps = dispatch => ({
  onExerciseStart: (attemptData, token) => {
    dispatch(actionCreators.startExercise(attemptData, token));
  },
  onExerciseFinish: (attemptId, token) => {
    dispatch(actionCreators.finishExercise(attemptId, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
