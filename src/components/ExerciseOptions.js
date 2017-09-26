import React, {Component} from 'react';
import {Label, Input, Button} from 'semantic-ui-react';

const MIN_WPM = 10;
const MAX_WPM = 1500;
const MIN_CHARACTER_COUNT = 5;
const MAX_CHARACTER_COUNT = 30;
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

  handleCharacterCountChange(event) {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_CHARACTER_COUNT) {
        this.setState({characterCount: MAX_CHARACTER_COUNT});
      } else {
        this.setState({characterCount: +event.target.value});
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
      characterCount: this.state.characterCount === '' || this.state.characterCount < MIN_CHARACTER_COUNT ? MIN_CHARACTER_COUNT : this.state.characterCount,
      fixation: this.state.fixation === '' || this.state.fixation < MIN_FIXATION ? MIN_FIXATION : this.state.fixation,
    }
    if (this.props.options.wpm !== correctedOptions.wpm || this.props.options.characterCount !== correctedOptions.characterCount || this.props.options.fixation !== correctedOptions.fixation) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  options() {
    if (this.props.exerciseType === 'reading' || this.props.exerciseType === 'disappearing') {
      return(
        <div>
          {'Reading speed '}
          <Button icon='minus' size='mini' />
          <Input 
            type='text'
            inverted
            size='small'
            value={this.state.wpm}
            onChange={this.handleWPMChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{ width: '64px', textAlign: 'right' }}
          />
          <Button icon='plus' size='mini' />
          {' words per minute'}
        </div>
      );
    } else if (this.props.exerciseType === 'wordGroup') {
      return (
        <div>
          <div>
            {'Character count '}
            <Button icon='minus' size='mini' />
            <Input 
              type='text'
              inverted
              size='small'
              value={this.state.characterCount}
              onChange={this.handleCharacterCountChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              style={{ width: '52px' }}
            />
            <Button icon='plus' size='mini' />
            {' characters'}
          </div>
          <div>
            {'Fixation time '}
            <Button icon='minus' size='mini' />
            <Input 
              type='text'
              inverted
              size='small'
              value={this.state.fixation}
              onChange={this.handleFixationChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              style={{ width: '52px' }}
            />
            <Button icon='plus' size='mini' />
            {' ms'}
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
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