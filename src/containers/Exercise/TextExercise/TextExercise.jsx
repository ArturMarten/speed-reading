import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { Dimmer, Grid, Segment } from 'semantic-ui-react';
import * as actionCreators from '../../../store/actions';
import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import Disappearing from '../Types/Disappearing/Disappearing';
import ReadingAid from '../Types/ReadingAid/ReadingAid';
import ReadingTest from '../Types/ReadingTest/ReadingTest';
import Scrolling from '../Types/Scrolling/Scrolling';
import MovingWordGroups from '../Types/MovingWordGroups/MovingWordGroups';
import VerticalReading from '../Types/VerticalReading/VerticalReading';
import WordGroups from '../Types/WordGroups/WordGroups';
import './TextExercise.css';

const TEXT_VERTICAL_PADDING = 0;
const TEXT_HORIZONTAL_PADDING = 70;

export class TextExercise extends Component {
  state = {
    canvasHeight: 250,
    canvasWidth: 400,
    heightCalculated: false,
  };

  componentDidMount() {
    this.calculateCanvasHeight();
    this.onExerciseStartHandler();
  }

  onExerciseStartHandler = () => {
    const attemptData = {
      userId: this.props.userId,
      save: this.props.saveExercise,
      exerciseId: this.props.exerciseId,
      modification: this.props.exerciseModification,
      startTime: new Date(),
      readingTextId: this.props.selectedText.id,
    };
    this.props.onExerciseStart(attemptData);
  };

  onExerciseFinishHandler = () => {
    this.props.onExerciseFinish(this.props.attemptId);
  };

  calculateCanvasHeight = () => {
    const canvasTop = document.querySelector('#canvasTop');
    const availableHeight = document.body.clientHeight - canvasTop.getBoundingClientRect().bottom - 20;
    const canvasHeight = Math.max(this.state.canvasHeight, availableHeight) - 5;
    const canvasWidth = Math.min(this.props.textOptions.width, window.innerWidth - 30);
    this.setState({ heightCalculated: true, canvasHeight, canvasWidth });
  };

  render() {
    const exercise = ((type) => {
      switch (type) {
        case 'readingTest':
          return (
            <ReadingTest
              canvasHeight={this.state.canvasHeight - 40}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              translate={this.props.translate}
            />
          );
        case 'readingAid':
          return (
            <ReadingAid
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
              translate={this.props.translate}
            />
          );
        case 'scrolling':
          return (
            <Scrolling
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        case 'disappearing':
          return (
            <Disappearing
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
              translate={this.props.translate}
            />
          );
        case 'wordGroups':
          return (
            <WordGroups
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              wordGroups={this.props.wordGroups}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        case 'verticalReading':
          return (
            <VerticalReading
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
              wordGroups={this.props.wordGroups}
              timerState={this.props.timerState}
              onExerciseFinish={this.onExerciseFinishHandler}
            />
          );
        case 'movingWordGroups':
          return (
            <MovingWordGroups
              canvasHeight={this.state.canvasHeight}
              canvasWidth={this.state.canvasWidth}
              selectedText={this.props.selectedText}
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
        <Grid.Row verticalAlign="middle" style={{ paddingBottom: 0 }}>
          <Grid.Column mobile={16} tablet={8} computer={8}>
            <table style={{ marginTop: '11px' }}>
              <tbody>
                <SpeedOptions exerciseType={this.props.type} />
              </tbody>
            </table>
          </Grid.Column>
          <Grid.Column textAlign="center" mobile={16} tablet={8} computer={8} style={{ marginTop: '5px' }}>
            <Timing
              loading={this.props.exerciseStatus === 'starting' || this.props.exerciseStatus === 'finishing'}
              showStopwatch={this.props.exerciseOptions.showStopwatch}
              onStart={this.onExerciseStartHandler}
              onStop={this.onExerciseFinishHandler}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered style={{ paddingTop: '0.4em' }}>
          <Segment compact>
            <Dimmer.Dimmable
              blurring
              dimmed={!this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped}
            >
              <div
                style={{
                  padding: `${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px ${TEXT_VERTICAL_PADDING}px ${TEXT_HORIZONTAL_PADDING}px`,
                }}
              >
                <div id="canvasTop" />
                {this.state.heightCalculated ? exercise : null}
              </div>
            </Dimmer.Dimmable>
          </Segment>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  userId: state.auth.userId,
  saveExercise: state.exercise.save,
  exerciseId: state.exercise.id,
  exerciseModification: state.exercise.modification,
  exerciseOptions: state.options.exerciseOptions,
  exerciseStatus: state.exercise.status,
  attemptId: state.exercise.attemptId,
  selectedText: state.text.selectedText,
  wordGroups: state.exercise.wordGroups,
  textOptions: state.options.textOptions,
  timerState: state.timing.timer,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseStart: (attemptData) => {
    dispatch(actionCreators.startExercise(attemptData));
  },
  onExerciseFinish: (attemptId) => {
    dispatch(actionCreators.finishReadingExercise(attemptId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
