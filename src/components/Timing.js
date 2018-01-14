import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Label, Icon} from 'semantic-ui-react';

let update = null;

class Timing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      elapsedTime: 0
    };
  }

  componentWillUnmount() {
    if (update) clearInterval(update);
  }

  componentDidUpdate(previous) {
    if (this.props.exerciseState.finished) clearInterval(update);
  }

  startClickHandler() {
    this.setState({
      startTime: Date.now()
    });
    update = setInterval(() => {
      this.progress();
    }, 1001);
    this.props.onStart();
  }

  pauseClickHandler() {
    clearInterval(update);
    this.progress();
    this.props.onPause();
  }

  resetClickHandler() {
    clearInterval(update);
    this.setState({
      startTime: 0,
      elapsedTime: 0
    });
    this.props.onReset();
  }

  finishClickHandler() {
    clearInterval(update);
    this.progress();
    this.props.onFinish();
  }

  progress() {
    this.setState({
      elapsedTime: this.state.elapsedTime + (Date.now() - this.state.startTime),
      startTime: Date.now()
    });
  }

  render() {
    return (
      <div>
        <Button circular
          disabled={this.props.exerciseState.finished}
          positive={!this.props.exerciseState.started || this.props.exerciseState.paused}
          negative={this.props.exerciseState.started && !this.props.exerciseState.paused}
          icon={this.props.exerciseState.started && !this.props.exerciseState.paused ? 'pause' : 'play'}
          onClick={() => this.props.exerciseState.started && !this.props.exerciseState.paused ? this.pauseClickHandler() : this.startClickHandler()}/>
        <Button circular color='orange' icon='repeat' inverted disabled={!this.props.exerciseState.started}
          onClick={() => this.resetClickHandler()}/>
        <Button circular color='blue' icon='flag checkered' inverted
          disabled={!this.props.exerciseState.started || this.props.exerciseState.finished}
          onClick={() => this.finishClickHandler()}/>
        <Label basic size='big' style={{marginTop: '5px'}}>
          <Icon name='clock' />{this.format(this.state.elapsedTime)}
        </Label>
      </div>
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
  exerciseState: PropTypes.object.isRequired
};

export default Timing;
