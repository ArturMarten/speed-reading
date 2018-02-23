import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button, Label, Icon} from 'semantic-ui-react';

import * as actionCreators from '../../../store/actions';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

let update = null;

export class Timing extends Component {
  state = {
    startTime: 0,
    elapsedTime: 0
  };

  componentWillUnmount() {
    if (update) clearInterval(update);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.timerState.stopped) clearInterval(update);
  }

  startTimer = () => {
    this.setState({
      startTime: Date.now()
    });
    update = setInterval(() => {
      this.progress();
    }, 1001);
  }

  startClickHandler = () => {
    this.startTimer();
    this.props.onStart();
  }

  pauseClickHandler = () => {
    clearInterval(update);
    this.progress();
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
      elapsedTime: 0
    });
    this.props.onReset();
  }

  stopClickHandler = () => {
    clearInterval(update);
    this.progress();
    this.props.onStop();
  }

  progress = () => {
    this.setState({
      elapsedTime: this.state.elapsedTime + (Date.now() - this.state.startTime),
      startTime: Date.now()
    });
  }

  render() {
    return (
      <Aux>
        <Button circular
          disabled={this.props.timerState.stopped}
          positive={!this.props.timerState.started || this.props.timerState.paused}
          negative={this.props.timerState.started && !this.props.timerState.paused}
          icon={!this.props.timerState.started || this.props.timerState.paused ? 'play' : 'pause'}
          onClick={this.props.timerState.started ? 
            (this.props.timerState.paused ? this.resumeClickHandler : this.pauseClickHandler) : 
            this.startClickHandler}/>
        <Button circular color='orange' icon='repeat' inverted disabled={!this.props.timerState.started}
          onClick={this.resetClickHandler}/>
        <Button circular color='blue' icon='flag checkered' inverted
          disabled={!this.props.timerState.started || this.props.timerState.stopped}
          onClick={this.stopClickHandler}/>
        <Label basic size='big' style={{marginTop: '5px'}}>
          <Icon name='clock' />{this.format(this.state.elapsedTime)}
        </Label>
      </Aux>
    );
  }

  format(time) {
    const pad = (time, length) => {
      while (time.length < length) {
        time = '0' + time;
      }
      return time;
    };
    time = new Date(time);
    let minutes = pad(time.getMinutes().toString(), 2);
    let seconds = pad(time.getSeconds().toString(), 2);
    return `${minutes}:${seconds}`;
  }
}

Timing.propTypes = {
  timerState: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  timerState: state.timing.timer,
});

const mapDispatchToProps = (dispatch) => ({
  onStart: () => {
    dispatch(actionCreators.startRequested());
  },
  onPause: () => {
    dispatch(actionCreators.pauseRequested());
  },
  onResume: () => {
    dispatch(actionCreators.resumeRequested());
  },
  onReset: () => {
    dispatch(actionCreators.resetRequested());
  },
  onStop: () => {
    dispatch(actionCreators.stopRequested());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);
