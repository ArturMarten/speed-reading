import React, {Component} from 'react';

class Timing extends Component  {
  constructor(props) {
    super(props);
  }

	componentWillUnmount() {}

  onStart() {
    this.props.onStart();
  }

  onStop() {
    this.props.onStop();
  }

  onReset() {
    this.props.onReset();
  }

  render() {
    return (
      <div className='timing'>
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
