import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Dimmer } from 'semantic-ui-react';

import './TextExercise.css';
import * as actionCreators from '../../../store/actions';
import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import Reading from '../Types/Reading';
import Disappearing from '../Types/Disappearing';
import WordGroups from '../Types/WordGroups';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

export class TextExercise extends Component {
  state = {};

  shouldComponentUpdate(nextProps) {
    return this.props.timerState !== nextProps.timerState;
  }

  render() {
    const exercise = ((type) => {
      switch (type) {
        case 'reading':
          return (
            <Reading
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.props.onExerciseFinish}
            />
          );
        case 'disappearing':
          return (
            <Disappearing
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.props.onExerciseFinish}
            />
          );
        case 'wordGroup':
          return (
            <WordGroups
              wordGroups={this.props.wordGroups}
              timerState={this.props.timerState}
              onExerciseFinish={this.props.onExerciseFinish}
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
              onStart={this.props.onExerciseStart}
              onStop={this.props.onExerciseFinish}
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
  selectedText: state.text.selectedText,
  wordGroups: state.exercise.wordGroups,
  timerState: state.timing.timer,
});

const mapDispatchToProps = dispatch => ({
  onExerciseStart: () => {
    dispatch(actionCreators.startExercise());
  },
  onExerciseFinish: () => {
    dispatch(actionCreators.finishExercise());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
