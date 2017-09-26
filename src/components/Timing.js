import React, {Component} from 'react';

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

  buttons() {
    if (this.props.finished) {
      return(<span> Exercise finished </span>);
    } else {
      return(
        <span className={this.props.started ? 'start-button' : 'stop-button'}>
          <button type='button' onClick={() => this.props.started ? this.onStop() : this.onStart()}>
            {this.props.started ? 'Stop' : 'Start'}
          </button>
        </span>
      );
    }
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
      <div className='timing'>
        {this.buttons()}
        <span className='reset-button'>
          <button type='button' onClick={() => this.onReset()}>
            Reset
          </button>
        </span>
        <span>
          {' Time ' + this.format(this.time)}
        </span>
      </div>
    );
  }
};

Timing.propTypes = {
  started: React.PropTypes.bool.isRequired
};

export default Timing;
