import React, {Component} from 'react';
import {Input, Button} from 'semantic-ui-react';

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

  decreaseWPM() {
    this.changeWPM(this.state.wpm - 10);
  }

  increaseWPM() {
    this.changeWPM(this.state.wpm + 10);
  }

  changeWPM(newValue) {
    let newWPM = this.state.wpm;
    if (newValue > MAX_WPM) {
      newWPM = MAX_WPM;
    } else if (newValue < MIN_WPM) {
      newWPM = MIN_WPM;
    } else {
      newWPM = newValue;
    }
    this.props.onSubmit({...this.state, wpm: newWPM});
    this.setState({wpm: newWPM});
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

  decreaseFixation() {
    this.changeFixation(this.state.fixation - 10);
  }

  increaseFixation() {
    this.changeFixation(this.state.fixation + 10);
  }

  changeFixation(newValue) {
    let newFixation = this.state.fixation;
    if (newValue > MAX_FIXATION) {
      newFixation = MAX_FIXATION;
    } else if (newValue < MIN_FIXATION) {
      newFixation = MIN_FIXATION;
    } else {
      newFixation = newValue;
    }
    this.props.onSubmit({...this.state, fixation: newFixation});
    this.setState({fixation: newFixation});
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

  decreaseCharacterCount() {
    this.changeCharacterCount(this.state.characterCount - 1);
  }

  increaseCharacterCount() {
    this.changeCharacterCount(this.state.characterCount + 1);
  }

  changeCharacterCount(newValue) {
    let newCharacterCount = this.state.characterCount;
    if (newValue > MAX_CHARACTER_COUNT) {
      newCharacterCount = MAX_CHARACTER_COUNT;
    } else if (newValue < MIN_CHARACTER_COUNT) {
      newCharacterCount = MIN_CHARACTER_COUNT;
    } else {
      newCharacterCount = newValue;
    }
    this.props.onSubmit({...this.state, characterCount: newCharacterCount});
    this.setState({characterCount: newCharacterCount});
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
      characterCount:
        (this.state.characterCount === '' || this.state.characterCount < MIN_CHARACTER_COUNT) ?
          MIN_CHARACTER_COUNT : this.state.characterCount,
      fixation: this.state.fixation === '' || this.state.fixation < MIN_FIXATION ? MIN_FIXATION : this.state.fixation,
    };
    if (
      this.props.options.wpm !== correctedOptions.wpm ||
      this.props.options.characterCount !== correctedOptions.characterCount ||
      this.props.options.fixation !== correctedOptions.fixation
    ) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  options() {
    if (this.props.exerciseType === 'reading' || this.props.exerciseType === 'disappearing') {
      return(
        <div>
          {'Reading speed '}
          <Button icon='plus' size='mini' onClick={this.increaseWPM.bind(this)} />
          <Button icon='minus' size='mini' onClick={this.decreaseWPM.bind(this)} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.wpm}
            onChange={this.handleWPMChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
            onBlur={this.handleBlur.bind(this)}
            style={{width: '64px', textAlign: 'right'}}
          />
          {' words per minute'}
        </div>
      );
    } else if (this.props.exerciseType === 'wordGroup') {
      return (
        <div>
          <div>
            {'Character count '}
            <Button icon='plus' size='mini' onClick={this.increaseCharacterCount.bind(this)} />
            <Button icon='minus' size='mini' onClick={this.decreaseCharacterCount.bind(this)} />
            <Input
              type='text'
              inverted
              size='small'
              value={this.state.characterCount}
              onChange={this.handleCharacterCountChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              style={{width: '52px'}}
            />
            {' characters'}
          </div>
          <div>
            {'Fixation time '}
            <Button icon='plus' size='mini' onClick={this.increaseFixation.bind(this)} />
            <Button icon='minus' size='mini' onClick={this.decreaseFixation.bind(this)} />
            <Input
              type='text'
              inverted
              size='small'
              value={this.state.fixation}
              onChange={this.handleFixationChange.bind(this)}
              onKeyPress={this.handleKeyPress.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              style={{width: '52px'}}
            />
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
