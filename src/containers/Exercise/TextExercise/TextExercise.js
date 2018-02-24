import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Grid, Segment, Dimmer} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import Reading from '../Types/Reading';
import Disappearing from '../Types/Disappearing';
import OneGroupVisible from '../Types/OneGroupVisible';

import './TextExercise.css';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

class TextExercise extends Component {

  exercise = ((type) => {
    switch (type) {
      case 'reading':
        return <Reading />;
      case 'disappearing':
        return <Disappearing />;
      case 'wordGroup':
        return <OneGroupVisible />;
      default:
        return null;
    }
  })(this.props.type);

  render() {
    return (
      <Container>
        <Grid>
          <Grid.Row verticalAlign='middle' columns={2}>
            <Grid.Column textAlign='center' width={8}>
              <SpeedOptions />
            </Grid.Column>
            <Grid.Column textAlign='center' width={8}>
              <Timing />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row centered>
            <Segment compact>
              <Dimmer.Dimmable blurring
                dimmed={!this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped }>
                <div style={{padding: TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px ' +
                                      TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px'}}>
                    {this.exercise}
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

const mapStateToProps = (state) => ({
  timerState: state.timing.timer,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);