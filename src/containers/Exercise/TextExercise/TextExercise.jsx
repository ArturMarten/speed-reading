import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Grid, Segment, Dimmer } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import Reading from '../Types/Reading';
import Disappearing from '../Types/Disappearing';
import WordGroups from '../Types/WordGroups';

import './TextExercise.css';

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
      <Container>
        <Grid>
          <Grid.Row verticalAlign="middle" columns={2}>
            <Grid.Column textAlign="center" width={8}>
              <SpeedOptions />
            </Grid.Column>
            <Grid.Column textAlign="center" width={8}>
              <Timing />
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
                  <div>{this.props.translate('exercises.page')} 1</div>
                </div>
              </Dimmer.Dimmable>
            </Segment>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  timerState: state.timing.timer,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
