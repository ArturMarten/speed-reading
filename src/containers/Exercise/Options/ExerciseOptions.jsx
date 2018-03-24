import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

import {
  MIN_CHARACTER_COUNT,
  MAX_CHARACTER_COUNT,
  MIN_START_DELAY,
  MAX_START_DELAY,
  MIN_LINE_BREAK_DELAY,
  MAX_LINE_BREAK_DELAY,
} from '../../../store/reducers/options';

export class ExerciseOptions extends PureComponent {
  state = {};
  render() {
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('characterCount') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('exercise-options.word-group-length')}
            unit={this.props.translate('exercise-options.characters')}
            value={this.props.options.characterCount}
            min={MIN_CHARACTER_COUNT}
            max={MAX_CHARACTER_COUNT}
            step={1}
            updateValue={value => this.props.onSubmit({ characterCount: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('startDelay') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('exercise-options.start-delay')}
            unit={this.props.translate('exercise-options.ms')}
            value={this.props.options.startDelay}
            min={MIN_START_DELAY}
            max={MAX_START_DELAY}
            step={50}
            updateValue={value => this.props.onSubmit({ startDelay: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('lineBreakDelay') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('exercise-options.line-break-delay')}
            unit={this.props.translate('exercise-options.ms')}
            value={this.props.options.lineBreakDelay}
            min={MIN_LINE_BREAK_DELAY}
            max={MAX_LINE_BREAK_DELAY}
            step={50}
            updateValue={value => this.props.onSubmit({ lineBreakDelay: value })}
          /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options.exerciseOptions,
  visibleOptions: state.options.visibleExerciseOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.exerciseOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
