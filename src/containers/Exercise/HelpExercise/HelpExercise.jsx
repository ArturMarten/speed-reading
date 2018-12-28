import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Dimmer } from 'semantic-ui-react';

import './HelpExercise.css';
import * as actionCreators from '../../../store/actions';
import Timing from '../Timing/Timing';
import SchulteTables from '../Types/SchulteTables/SchulteTables';
import Concentration from '../Types/Concentration/Concentration';

export class HelpExercise extends Component {
  state = {};

  componentDidMount() {
    this.onExerciseStartHandler();
  }

  onExerciseStartHandler = () => {
    const attemptData = {
      userId: this.props.userId,
      save: this.props.saveExercise,
      exerciseId: this.props.exerciseId,
      modification: this.props.exerciseModification,
      startTime: new Date(),
    };
    this.props.onExerciseStart(attemptData);
  }

  onExerciseFinishHandler = () => {
    let data = null;
    if (this.props.type === 'concentration') {
      const { answers } = this.exerciseRef.state;
      data = { answers };
    }
    this.props.onExerciseFinish(this.props.attemptId, data);
  }

  render() {
    const exercise = ((type) => {
      switch (type) {
        case 'schulteTables':
          return (
            <SchulteTables
              ref={(ref) => { this.exerciseRef = ref; }}
            />
          );
        case 'concentration':
          return (
            <Concentration
              ref={(ref) => { this.exerciseRef = ref; }}
              onExerciseFinish={this.onExerciseFinishHandler}
              timerState={this.props.timerState}
            />
          );
        default:
          return null;
      }
    })(this.props.type);
    return (
      <Grid container>
        <Grid.Row verticalAlign="middle" style={{ paddingBottom: 0 }}>
          <Grid.Column textAlign="center" width={8} />
          <Grid.Column textAlign="center" width={8}>
            <Timing
              loading={this.props.exerciseStatus === 'starting' || this.props.exerciseStatus === 'finishing'}
              onStart={this.onExerciseStartHandler}
              onStop={this.onExerciseFinishHandler}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered style={{ paddingTop: '0.4em' }}>
          <Dimmer.Dimmable
            style={{
              filter: !this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped ?
                'blur(20px) grayscale(0.7)' : null,
            }}
            blurring
            dimmed={!this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped}
          >
            {exercise}
          </Dimmer.Dimmable>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  saveExercise: state.exercise.save,
  exerciseId: state.exercise.id,
  exerciseModification: state.exercise.modification,
  exerciseStatus: state.exercise.status,
  attemptId: state.exercise.attemptId,
  selectedText: state.text.selectedText,
  wordGroups: state.exercise.wordGroups,
  timerState: state.timing.timer,
});

const mapDispatchToProps = dispatch => ({
  onExerciseStart: (attemptData) => {
    dispatch(actionCreators.startExercise(attemptData));
  },
  onExerciseFinish: (attemptId, data) => {
    dispatch(actionCreators.finishHelpExercise(attemptId, data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpExercise);
