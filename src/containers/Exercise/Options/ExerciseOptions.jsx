import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';
import ExerciseSelectOption from '../../../components/Exercise/Options/ExerciseSelectOption';
import ExerciseCheckOption from '../../../components/Exercise/Options/ExerciseCheckOption';

import {
  cursorTypeOptions,
  cursorColorOptions,
  tableDimensionOptions,
  MIN_START_DELAY,
  MAX_START_DELAY,
  STEP_START_DELAY,
  MIN_LINE_BREAK_DELAY,
  MAX_LINE_BREAK_DELAY,
  STEP_LINE_BREAK_DELAY,
  MIN_PAGE_BREAK_DELAY,
  MAX_PAGE_BREAK_DELAY,
  STEP_PAGE_BREAK_DELAY,
  MIN_GROUP_CHARACTER_COUNT,
  MAX_GROUP_CHARACTER_COUNT,
  STEP_GROUP_CHARACTER_COUNT,
  MIN_GROUP_SPACING,
  MAX_GROUP_SPACING,
  STEP_GROUP_SPACING,
  MIN_TABLE_SIZE,
  MAX_TABLE_SIZE,
  STEP_TABLE_SIZE,
  MIN_SYMBOL_GROUP_COUNT,
  MAX_SYMBOL_GROUP_COUNT,
  STEP_SYMBOL_GROUP_COUNT,
  MIN_SYMBOL_COUNT,
  MAX_SYMBOL_COUNT,
  STEP_SYMBOL_COUNT,
  MIN_COLUMN_SPACING,
  MAX_COLUMN_SPACING,
  STEP_COLUMN_SPACING,
} from '../../../store/reducers/options';

export class ExerciseOptions extends PureComponent {
  state = {};

  render() {
    const cursorTypeOptionsTranslated = cursorTypeOptions.map((option, index) => ({
      ...option,
      key: index,
      text: this.props.translate(`exercise-options.cursor-${option.value}`),
    }));
    const cursorColorOptionsTranslated = cursorColorOptions.map((option, index) => ({
      ...option,
      key: index,
      text: this.props.translate(`colors.${option.value}`),
    }));
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('startDelay') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.start-delay')}
            description={this.props.translate('exercise-options.start-delay-description')}
            unit={this.props.translate('exercise-options.ms')}
            value={this.props.options.startDelay}
            min={MIN_START_DELAY}
            max={MAX_START_DELAY}
            step={STEP_START_DELAY}
            updateValue={(value) => this.props.onSubmit({ startDelay: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('lineBreakDelay') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.line-break-delay')}
            description={this.props.translate('exercise-options.line-break-delay-description')}
            unit={this.props.translate('exercise-options.ms')}
            value={this.props.options.lineBreakDelay}
            min={MIN_LINE_BREAK_DELAY}
            max={MAX_LINE_BREAK_DELAY}
            step={STEP_LINE_BREAK_DELAY}
            updateValue={(value) => this.props.onSubmit({ lineBreakDelay: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('pageBreakDelay') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.page-break-delay')}
            description={this.props.translate('exercise-options.page-break-delay-description')}
            unit={this.props.translate('exercise-options.ms')}
            value={this.props.options.pageBreakDelay}
            min={MIN_PAGE_BREAK_DELAY}
            max={MAX_PAGE_BREAK_DELAY}
            step={STEP_PAGE_BREAK_DELAY}
            updateValue={(value) => this.props.onSubmit({ pageBreakDelay: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('cursorType') !== -1 ? (
          <ExerciseSelectOption
            name={this.props.translate('exercise-options.cursor-type')}
            value={this.props.options.cursorType}
            options={cursorTypeOptionsTranslated}
            updateValue={(value) => this.props.onSubmit({ cursorType: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('cursorColor') !== -1 ? (
          <ExerciseSelectOption
            name={this.props.translate('exercise-options.cursor-color')}
            value={this.props.options.cursorColor}
            options={cursorColorOptionsTranslated}
            updateValue={(value) => this.props.onSubmit({ cursorColor: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('groupCharacterCount') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.word-group-length')}
            description={this.props.translate('exercise-options.word-group-length-description')}
            unit={this.props.translate('exercise-options.characters')}
            value={this.props.options.groupCharacterCount}
            min={MIN_GROUP_CHARACTER_COUNT}
            max={MAX_GROUP_CHARACTER_COUNT}
            step={STEP_GROUP_CHARACTER_COUNT}
            updateValue={(value) => this.props.onSubmit({ groupCharacterCount: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('groupSpacing') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.word-group-spacing')}
            description={this.props.translate('exercise-options.word-group-spacing-description')}
            unit={this.props.translate('exercise-options.px')}
            value={this.props.options.groupSpacing}
            min={MIN_GROUP_SPACING}
            max={MAX_GROUP_SPACING}
            step={STEP_GROUP_SPACING}
            updateValue={(value) => this.props.onSubmit({ groupSpacing: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('tableDimensions') !== -1 ? (
          <ExerciseSelectOption
            name={this.props.translate('exercise-options.table-dimensions')}
            value={this.props.options.tableDimensions}
            options={tableDimensionOptions}
            updateValue={(value) => this.props.onSubmit({ tableDimensions: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('tableSize') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.table-size')}
            unit={this.props.translate('exercise-options.percentage')}
            value={this.props.options.tableSize}
            min={MIN_TABLE_SIZE}
            max={MAX_TABLE_SIZE}
            step={STEP_TABLE_SIZE}
            updateValue={(value) => this.props.onSubmit({ tableSize: value })}
          />
        ) : null}
        {/*
        {this.props.visibleOptions.indexOf('tableCheck') !== -1 ? (
          <ExerciseCheckOption
            name={this.props.translate('exercise-options.table-check')}
            value={this.props.options.tableCheck}
            updateValue={(value) => this.props.onSubmit({ tableCheck: value })}
          />
        ) : null}
         */}
        {this.props.visibleOptions.indexOf('symbolGroupCount') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.symbol-group-count')}
            unit={this.props.translate('exercise-options.groups')}
            value={this.props.options.symbolGroupCount}
            min={MIN_SYMBOL_GROUP_COUNT}
            max={MAX_SYMBOL_GROUP_COUNT}
            step={STEP_SYMBOL_GROUP_COUNT}
            updateValue={(value) => this.props.onSubmit({ symbolGroupCount: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('symbolCount') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.symbol-count')}
            unit={this.props.translate('exercise-options.symbols')}
            value={this.props.options.symbolCount}
            min={MIN_SYMBOL_COUNT}
            max={MAX_SYMBOL_COUNT}
            step={STEP_SYMBOL_COUNT}
            updateValue={(value) => this.props.onSubmit({ symbolCount: value })}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('columnSpacing') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('exercise-options.column-spacing')}
            unit={this.props.translate('exercise-options.px')}
            value={this.props.options.columnSpacing}
            min={MIN_COLUMN_SPACING}
            max={MAX_COLUMN_SPACING}
            step={STEP_COLUMN_SPACING}
            updateValue={(value) => this.props.onSubmit({ columnSpacing: value })}
          />
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  options: state.options.exerciseOptions,
  visibleOptions: state.options.visibleExerciseOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (option) => dispatch(actionCreators.exerciseOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
