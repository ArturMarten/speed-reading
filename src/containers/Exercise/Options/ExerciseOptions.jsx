import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

const MIN_CHARACTER_COUNT = 5;
const MAX_CHARACTER_COUNT = 30;

export class ExerciseOptions extends Component {
  state = {};
  render() {
    if (this.props.exerciseType === 'wordGroup') {
      return (
        <Fragment>
          <ExerciseInputOption
            name={this.props.translate('exercise-options.word-group-length')}
            unit={this.props.translate('exercise-options.characters')}
            value={this.props.options.characterCount}
            min={MIN_CHARACTER_COUNT}
            max={MAX_CHARACTER_COUNT}
            step={1}
            updateValue={value => this.props.onSubmit({ characterCount: value })}
          />
        </Fragment>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  options: state.options.exerciseOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.exerciseOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
