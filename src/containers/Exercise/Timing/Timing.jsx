import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Label, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import MediaQuery from 'react-responsive';

let update = null;

const format = (input) => {
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
};

export class Timing extends Component {
  state = {
    startTime: 0,
    elapsedTime: 0,
  };

  componentDidUpdate(prevProps) {
    if (this.props.timerState.stopped) clearInterval(update);
    if (!prevProps.timerState.started && this.props.timerState.started) {
      this.startTimer();
    }
    if (!prevProps.timerState.resetted && this.props.timerState.resetted) {
      this.resetTimer();
    }
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
    }, 1000);
  };

  resetTimer = () => {
    clearInterval(update);
    this.setState({
      startTime: 0,
      elapsedTime: 0,
    });
  };

  startClickHandler = () => {
    this.props.onStart();
  };

  pauseClickHandler = () => {
    clearInterval(update);
    this.calculateElapsedTime();
    this.props.onPause();
  };

  resumeClickHandler = () => {
    this.startTimer();
    this.props.onResume();
  };

  resetClickHandler = () => {
    this.resetTimer();
    this.props.onReset();
  };

  stopClickHandler = () => {
    const confirmedStop = window.confirm(this.props.translate('timing.confirm'));
    if (!confirmedStop) {
      return;
    }
    clearInterval(update);
    if (!this.props.timerState.paused) {
      this.calculateElapsedTime();
    }
    this.props.onStop();
  };

  calculateElapsedTime = () => {
    this.setState({
      elapsedTime: this.state.elapsedTime + (Date.now() - this.state.startTime),
      startTime: Date.now(),
    });
  };

  render() {
    let clickHandler = this.startClickHandler;
    if (this.props.timerState.started) {
      if (this.props.timerState.paused) {
        clickHandler = this.resumeClickHandler;
      } else {
        clickHandler = this.pauseClickHandler;
      }
    }
    const startButtonContent = () => {
      if (!this.props.timerState.started) {
        return this.props.translate('timing.start');
      }
      if (this.props.timerState.paused) {
        return this.props.translate('timing.resume');
      }
      return this.props.translate('timing.pause');
    };

    return (
      <Fragment>
        <MediaQuery maxWidth={991}>
          <Button
            circular
            positive={!this.props.timerState.started || this.props.timerState.paused}
            negative={this.props.timerState.started && !this.props.timerState.paused}
            icon={!this.props.timerState.started || this.props.timerState.paused ? 'play' : 'pause'}
            disabled={this.props.timerState.stopped || this.props.loading}
            loading={this.props.loading}
            aria-label={startButtonContent()}
            onClick={clickHandler}
          />
          <Button
            circular
            color="orange"
            icon="repeat"
            inverted
            disabled={!this.props.timerState.started}
            loading={this.props.loading}
            aria-label={this.props.translate('timing.reset')}
            onClick={this.resetClickHandler}
          />
          <Button
            circular
            color="blue"
            icon="flag checkered"
            inverted
            disabled={!this.props.timerState.started || this.props.timerState.stopped}
            loading={this.props.loading}
            aria-label={this.props.translate('timing.stop')}
            onClick={this.stopClickHandler}
          />
          {this.props.showStopwatch ? (
            <Label basic size="big">
              <Icon name="clock outline" />
              {format(this.state.elapsedTime)}
            </Label>
          ) : null}
        </MediaQuery>
        <MediaQuery minWidth={992}>
          <Button
            circular
            positive={!this.props.timerState.started || this.props.timerState.paused}
            negative={this.props.timerState.started && !this.props.timerState.paused}
            icon={!this.props.timerState.started || this.props.timerState.paused ? 'play' : 'pause'}
            content={startButtonContent()}
            disabled={this.props.timerState.stopped || this.props.loading}
            loading={this.props.loading}
            aria-label={startButtonContent()}
            onClick={clickHandler}
          />
          <Button
            circular
            color="orange"
            icon="repeat"
            inverted
            content={this.props.translate('timing.reset')}
            disabled={!this.props.timerState.started}
            loading={this.props.loading}
            aria-label={this.props.translate('timing.reset')}
            onClick={this.resetClickHandler}
          />
          <Button
            circular
            color="blue"
            icon="flag checkered"
            inverted
            content={this.props.translate('timing.stop')}
            disabled={!this.props.timerState.started || this.props.timerState.stopped}
            loading={this.props.loading}
            aria-label={this.props.translate('timing.stop')}
            onClick={this.stopClickHandler}
          />
          {this.props.showStopwatch ? (
            <Label basic size="big">
              <Icon name="clock outline" />
              {format(this.state.elapsedTime)}
            </Label>
          ) : null}
        </MediaQuery>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  timerState: state.timing.timer,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
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
