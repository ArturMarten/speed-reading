import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

const MIN_CHARACTER_COUNT = 5;
const MAX_CHARACTER_COUNT = 30;
const MIN_START_DELAY = 0;
const MAX_START_DELAY = 500;
const MIN_LINE_BREAK_DELAY = 0;
const MAX_LINE_BREAK_DELAY = 300;

export class ExerciseOptions extends Component {
  state = {};
  render() {
    const delayOptions = (
      <Fragment>
        <ExerciseInputOption
          name={this.props.translate('exercise-options.start-delay')}
          unit={this.props.translate('exercise-options.ms')}
          value={this.props.options.startDelay}
          min={MIN_START_DELAY}
          max={MAX_START_DELAY}
          step={50}
          updateValue={value => this.props.onSubmit({ startDelay: value })}
        />
        <ExerciseInputOption
          name={this.props.translate('exercise-options.line-break-delay')}
          unit={this.props.translate('exercise-options.ms')}
          value={this.props.options.lineBreakDelay}
          min={MIN_LINE_BREAK_DELAY}
          max={MAX_LINE_BREAK_DELAY}
          step={50}
          updateValue={value => this.props.onSubmit({ lineBreakDelay: value })}
        />
      </Fragment>
    );
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
          {delayOptions}
        </Fragment>
      );
    }
    return delayOptions;
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
