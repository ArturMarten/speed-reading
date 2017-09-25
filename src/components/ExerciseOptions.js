import React, {Component} from 'react';

const MIN_WPM = 10;
const MAX_WPM = 1500;
const MIN_FIXATION = 20;
const MAX_FIXATION = 500;

class ExerciseOptions extends Component {
  constructor(props) {
    super(props);
    this.state = props.options;
  }

  handleWPMChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_WPM) {
        this.setState({wpm: MAX_WPM});
      } else {
        this.setState({wpm: +event.target.value});
      }
    }
  }

  handleFixationChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_FIXATION) {
        this.setState({fixation: MAX_FIXATION});
      } else {
        this.setState({fixation: +event.target.value});
      }
    }
  }

  handleKeyPress(event) {
    if(event.key == 'Enter') {
      this.submitOptions();
    }
  }

  handleBlur(event) {
    this.submitOptions();
  }

  submitOptions() {
    const correctedOptions = {
      wpm: this.state.wpm === '' || this.state.wpm < MIN_WPM ? MIN_WPM : this.state.wpm,
      fixation: this.state.fixation === '' || this.state.fixation < MIN_FIXATION ? MIN_FIXATION : this.state.fixation,
    }
    if (this.props.options.wpm !== correctedOptions.wpm || this.props.options.fixation !== correctedOptions.fixation) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  options() {
    if (this.props.exerciseType === 'reading' || this.props.exerciseType === 'disappearing') {
      return(
        <div className="exercise-options-wpm">
          <span>Reading speed </span>
          <input
            type='text'
            value={this.state.wpm}
            onChange={this.handleWPMChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{ width: '31px', textAlign: 'right' }}
          />
          <span> words per minute</span>
        </div>
      );
    } else {
      return (
        <div className="exercise-options-fixation">
          <span>Fixation time </span>
          <input
            type='text'
            value={this.state.fixation}
            onChange={this.handleFixationChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{ width: '22px', textAlign: 'right' }}
          />
          <span>ms</span>
        </div>
      );
    }
  }

  render() {
    return(
      <div className="exercise-options">
        {this.options()}
      </div>
    );
  }
}

export default ExerciseOptions;