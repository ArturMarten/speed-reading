import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Input, Button} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const MIN_CHARACTER_COUNT = 5;
const MAX_CHARACTER_COUNT = 30;

export class ExerciseOptions extends Component {
  state = {
    ...this.props.options
  };

  handleCharacterCountChange = (event) => {
    if (/^-?\d*$/.test(event.target.value)) {
      if (event.target.value > MAX_CHARACTER_COUNT) {
        this.setState({characterCount: MAX_CHARACTER_COUNT});
      } else {
        this.setState({characterCount: +event.target.value});
      }
    }
  }

  decreaseCharacterCount = () => {
    this.changeCharacterCount(this.state.characterCount - 1);
  }

  increaseCharacterCount = () => {
    this.changeCharacterCount(this.state.characterCount + 1);
  }

  changeCharacterCount = (newValue) => {
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
      characterCount:
        (this.state.characterCount === '' || this.state.characterCount < MIN_CHARACTER_COUNT) ?
          MIN_CHARACTER_COUNT : this.state.characterCount,
    };
    if (
      this.props.options.characterCount !== correctedOptions.characterCount
    ) {
      this.props.onSubmit(correctedOptions);
    }
    this.setState(correctedOptions);
  }

  options() {
    if (this.props.exerciseType === 'wordGroup') {
      return (
        <Aux>
          {this.props.translate('exercise-options.character-count') + ' '}
          <Button icon='minus' size='mini' onClick={this.decreaseCharacterCount} />
          <Button icon='plus' size='mini' onClick={this.increaseCharacterCount} />
          <Input
            type='text'
            inverted
            size='small'
            value={this.state.characterCount}
            onChange={this.handleCharacterCountChange}
            onKeyPress={this.handleKeyPress}
            onBlur={this.handleBlur}
            style={{width: '52px'}}
          />
          {' ' + this.props.translate('exercise-options.characters')}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
