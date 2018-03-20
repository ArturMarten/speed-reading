import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon } from 'semantic-ui-react';

import * as actionCreators from '../../../store/actions';

let update = null;

function format(input) {
  const pad = (time, length) => {
    let result = time;
    while (result.length < length) {
      result = `0${result}`;
    }
    return result;
  };
  const inputTime = new Date(input);
  const minutes = pad(inputTime.getMinutes().toString(), 2);
  const seconds = pad(inputTime.getSeconds().toString(), 2);
  return `${minutes}:${seconds}`;
}

export class Timing extends Component {
  state = {
    startTime: 0,
    elapsedTime: 0,
  };

  componentDidUpdate() {
    if (this.props.timerState.stopped) clearInterval(update);
  }

  componentWillUnmount() {
    if (update) clearInterval(update);
  }

  startTimer = () => {
    this.setState({
      startTime: Date.now(),
    });
    update = setInterval(() => {
      this.calculateElapsedTime();
    }, 1001);
  }

  startClickHandler = () => {
    this.startTimer();
    this.props.onStart();
  }

  pauseClickHandler = () => {
    clearInterval(update);
    this.calculateElapsedTime();
    this.props.onPause();
  }

  resumeClickHandler = () => {
    this.startTimer();
    this.props.onResume();
  }

  resetClickHandler = () => {
    clearInterval(update);
    this.setState({
      startTime: 0,
      elapsedTime: 0,
    });
    this.props.onReset();
  }

  stopClickHandler = () => {
    clearInterval(update);
    if (!this.props.timerState.paused) {
      this.calculateElapsedTime();
    }
    this.props.onStop();
  }

  calculateElapsedTime = () => {
    this.setState({
      elapsedTime: this.state.elapsedTime + (Date.now() - this.state.startTime),
      startTime: Date.now(),
    });
  }

  render() {
    let clickHandler = this.startClickHandler;
    if (this.props.timerState.started) {
      if (this.props.timerState.paused) {
        clickHandler = this.resumeClickHandler;
      } else {
        clickHandler = this.pauseClickHandler;
      }
    }
    return (
      <Fragment>
        <Button
          circular
          disabled={this.props.timerState.stopped}
          positive={!this.props.timerState.started || this.props.timerState.paused}
          negative={this.props.timerState.started && !this.props.timerState.paused}
          icon={!this.props.timerState.started || this.props.timerState.paused ? 'play' : 'pause'}
          onClick={clickHandler}
        />
        <Button
          circular
          color="orange"
          icon="repeat"
          inverted
          disabled={!this.props.timerState.started}
          onClick={this.resetClickHandler}
        />
        <Button
          circular
          color="blue"
          icon="flag checkered"
          inverted
          disabled={!this.props.timerState.started || this.props.timerState.stopped}
          onClick={this.stopClickHandler}
        />
        <Label basic size="big" style={{ marginTop: '5px' }}>
          <Icon name="clock" />{format(this.state.elapsedTime)}
        </Label>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  timerState: state.timing.timer,
});

const mapDispatchToProps = dispatch => ({
  onPause: () => {
    dispatch(actionCreators.pauseTimer());
  },
  onResume: () => {
    dispatch(actionCreators.resumeTimer());
  },
  onReset: () => {
    dispatch(actionCreators.resetTimer());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);
