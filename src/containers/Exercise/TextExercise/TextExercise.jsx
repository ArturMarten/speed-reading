import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Dimmer } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import './TextExercise.css';
import * as actionCreators from '../../../store/actions';
import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import Reading from '../Types/Reading';
import Disappearing from '../Types/Disappearing';
import WordGroups from '../Types/WordGroups';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

class TextExercise extends Component {
  state = {};
  render() {
    const exercise = ((type) => {
      switch (type) {
        case 'reading':
          return <Reading />;
        case 'disappearing':
          return <Disappearing />;
        case 'wordGroup':
          return <WordGroups />;
        default:
          return null;
      }
    })(this.props.type);
    return (
      <Grid container>
        <Grid.Row verticalAlign="middle">
          <Grid.Column textAlign="center" width={8}>
            <SpeedOptions />
          </Grid.Column>
          <Grid.Column textAlign="center" width={8}>
            <Timing
              onStart={this.props.onTextExerciseStart}
              onStop={this.props.onTextExerciseFinish}
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
  timerState: state.timing.timer,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onTextExerciseStart: () => {
    dispatch(actionCreators.startExercise());
  },
  onTextExerciseFinish: () => {
    dispatch(actionCreators.finishExercise());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
