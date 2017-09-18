import React, {Component} from 'react';

class Timing extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      timer: 0,
      counter: 0,
      fixation: props.fixation
    }
  }

  componentWillUnmount() {}
  componentDidUpdate() {
    if(this.props.started && this.state.counter === this.props.counter) {
      this.state.timer = setTimeout(() => {this.props.onTick()}, this.props.fixation);
      this.state.counter = this.state.counter + 1;
    }
  }

  onStart() {
    this.props.onStart();
  }

  onStop() {
    clearTimeout(this.timer);
    this.props.onStop();
    this.state.counter = this.props.counter;
  }

  onReset() {
    clearTimeout(this.timer);
    this.props.onReset();
    this.state.counter = 0;
  }

  handleFixationChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      this.setState({fixation: event.target.value});
    }
  }

  handleKeyPress(event) {
    if(event.key == 'Enter' && this.state.fixation != '') {
      this.props.onSubmit(this.state.fixation);
    }
  }

  render() {
    return (
      <div className='timing'>
        <span>Fixation time </span>
        <input
          type='number'
          value={this.state.fixation}
          onChange={this.handleFixationChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          style={{ width: '40px' }}
        />
        <span className={this.props.started ? 'start-button' : 'stop-button'}>
          <button type='button' onClick={() => this.props.started ? this.onStop() : this.onStart()}>
            {this.props.started ? 'Stop' : 'Start'}
          </button>
        </span>
        <span className='reset-button'>
          <button type='button' onClick={() => this.onReset()}>
            Reset
          </button>
        </span>
      </div>
    );
  }
};

Timing.propTypes = {
  started: React.PropTypes.bool.isRequired
};

export default Timing;
