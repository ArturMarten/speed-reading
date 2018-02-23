import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Input, Button} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const MIN_WPM = 10;
const MAX_WPM = 500;
const MIN_FIXATION = 20;
const MAX_FIXATION = 500;

export class SpeedOptions extends Component {
  state = {
    ...this.props.options
  };
  
  handleWPMChange = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_WPM) {
        this.setState({wpm: MAX_WPM});
      } else {
        this.setState({wpm: +event.target.value});
      }
    }
  }

  decreaseWPM = () => {
    this.changeWPM(this.state.wpm - 10);
  }

  increaseWPM = () => {
    this.changeWPM(this.state.wpm + 10);
  }

  changeWPM = (newValue) => {
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

  handleFixationChange = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_FIXATION) {
        this.setState({fixation: MAX_FIXATION});
      } else {
        this.setState({fixation: +event.target.value});
      }
    }
  }

  decreaseFixation = () => {
    this.changeFixation(this.state.fixation - 10);
  }

  increaseFixation = () => {
    this.changeFixation(this.state.fixation + 10);
  }

  changeFixation = (newValue) => {
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

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.submitOptions();
    }
  }

  handleBlur = (event) => {
    this.submitOptions();
  }

  submitOptions = () => {
    const correctedOptions = {
      wpm: this.state.wpm === '' || this.state.wpm < MIN_WPM ? MIN_WPM : this.state.wpm,
      fixation: this.state.fixation === '' || this.state.fixation < MIN_FIXATION ? MIN_FIXATION : this.state.fixation,
    };
    if (
      this.props.options.wpm !== correctedOptions.wpm ||
      this.props.options.fixation !== correctedOptions.fixation
    ) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  options = () => {
    if (this.props.exerciseType === 'reading' || this.props.exerciseType === 'disappearing') {
      return (
        <Aux>
          {this.props.translate('exercise-options.reading-speed') + ' '}
          <Button icon='minus' size='mini' onClick={this.decreaseWPM} />
          <Button icon='plus' size='mini' onClick={this.increaseWPM} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.wpm}
            onChange={this.handleWPMChange}
            onKeyPress={this.handleKeyPress}
            onBlur={this.handleBlur}
            style={{width: '64px', textAlign: 'right'}}
          />
          {' ' + this.props.translate('exercise-options.wpm')}
        </Aux>
      );
    } else if (this.props.exerciseType === 'wordGroup') {
      return (
        <Aux>
          {this.props.translate('exercise-options.fixation-time') + ' '}
          <Button icon='minus' size='mini' onClick={this.decreaseFixation} />
          <Button icon='plus' size='mini' onClick={this.increaseFixation} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.fixation}
            onChange={this.handleFixationChange}
            onKeyPress={this.handleKeyPress}
            onBlur={this.handleBlur}
            style={{width: '52px'}}
          />
          {' ' + this.props.translate('exercise-options.ms')}
        </Aux>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="exercise-options">
        {this.options()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  options: state.exercise.exerciseOptions,
  exerciseType: state.exercise.type,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(actionCreators.exerciseOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedOptions);
