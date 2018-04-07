import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';
import ExerciseSelectOption from '../../../components/Exercise/Options/ExerciseSelectOption';
import ExerciseCheckOption from '../../../components/Exercise/Options/ExerciseCheckOption';

import {
  tableSizeOptions,
  MIN_CHARACTER_COUNT,
  MAX_CHARACTER_COUNT,
  MIN_START_DELAY,
  MAX_START_DELAY,
  MIN_LINE_BREAK_DELAY,
  MAX_LINE_BREAK_DELAY,
  MIN_SYMBOL_COUNT,
  MAX_SYMBOL_COUNT,
  MIN_COLUMN_SPACING,
  MAX_COLUMN_SPACING,
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
        {this.props.visibleOptions.indexOf('tableSize') !== -1 ?
          <ExerciseSelectOption
            name={this.props.translate('exercise-options.table-size')}
            value={this.props.options.tableSize}
            options={tableSizeOptions}
            updateValue={value => this.props.onSubmit({ tableSize: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('tableCheck') !== -1 ?
          <ExerciseCheckOption
            name={this.props.translate('exercise-options.table-check')}
            value={this.props.options.tableCheck}
            updateValue={value => this.props.onSubmit({ tableCheck: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('symbolCount') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('exercise-options.symbol-count')}
            unit={this.props.translate('exercise-options.symbols')}
            value={this.props.options.symbolCount}
            min={MIN_SYMBOL_COUNT}
            max={MAX_SYMBOL_COUNT}
            step={1}
            updateValue={value => this.props.onSubmit({ symbolCount: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('columnSpacing') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('exercise-options.column-spacing')}
            unit={this.props.translate('exercise-options.px')}
            value={this.props.options.columnSpacing}
            min={MIN_COLUMN_SPACING}
            max={MAX_COLUMN_SPACING}
            step={10}
            updateValue={value => this.props.onSubmit({ columnSpacing: value })}
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
