import React, {Component} from 'react';

let timer = null;
class Timing extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      fixation: props.fixation
    }
  }

  componentWillUnmount() {}
  componentDidUpdate(previous) {
    if(!previous.finished && this.props.finished) {
      clearTimeout(timer);
      this.props.onStop();
    }
    if(this.props.started && previous.counter + 1 === this.props.counter) {
      timer = setTimeout(() => {this.props.onTick()}, this.props.fixation);
    }
  }

  onStart() {
    this.props.onStart();
    timer = setTimeout(() => {this.props.onTick()}, this.props.fixation);
  }

  onStop() {
    clearTimeout(timer);
    this.props.onStop();
  }

  onReset() {
    clearTimeout(timer);
    this.props.onReset();
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
        <span>ms</span>
        <div>
          {this.buttons()}
          <span className='reset-button'>
          <button type='button' onClick={() => this.onReset()}>
            Reset
          </button>
        </span>
        </div>
      </div>
    );
  }
};

Timing.propTypes = {
  started: React.PropTypes.bool.isRequired
};

export default Timing;
