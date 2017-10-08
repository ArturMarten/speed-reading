import React, {Component} from 'react';
import {Button, Label, Icon} from 'semantic-ui-react';

let update = null;

class Timing extends Component  {
  constructor(props) {
    super(props);
    this.time = 0;
    this.offset = 0;
  }

  componentWillUnmount() {
    if (update) clearInterval(update);
  }

  onStart() {
    this.offset = Date.now();
    update = setInterval(() => {this.progress()}, 1000);
    this.props.onStart();
  }

  onStop() {
    clearInterval(update);
    this.props.onStop();
  }

  onReset() {
    clearInterval(update);
    this.time = 0;
    this.forceUpdate();
    this.props.onReset();
  }
  
  format(time) {
    const pad = (time, length) => {
      while (time.length < length) {
        time = '0' + time;
      }
      return time;
    }
    time = new Date(time);
    let minutes = pad(time.getMinutes().toString(), 2);
    let seconds = pad(time.getSeconds().toString(), 2);
    return `${minutes}:${seconds}`;
  }

  progress() {
    this.time = Date.now() - this.offset;
    this.forceUpdate();
	}
  
  render() {
    return (
      <div>
        <Button circular positive={!this.props.started} negative={this.props.started} icon={this.props.started ? 'pause' : 'play'} 
          onClick={() => this.props.started ? this.onStop() : this.onStart()}/>
        <Button circular color='blue' inverted icon='undo' 
          onClick={() => this.onReset()}/>
        <Label basic size='big'>
          <Icon name='clock' />{this.format(this.time)}
        </Label>
      </div>
    );
  }
};

Timing.propTypes = {
  started: React.PropTypes.bool.isRequired
};

export default Timing;
