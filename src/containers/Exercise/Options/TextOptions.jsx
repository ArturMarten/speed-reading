import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseSelectOption from '../../../components/Exercise/Options/ExerciseSelectOption';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

import {
  fontOptions,
  MIN_TEXT_WIDTH,
  MAX_TEXT_WIDTH,
  STEP_TEXT_WIDTH,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  STEP_FONT_SIZE,
  MIN_SYMBOL_SIZE,
  MAX_SYMBOL_SIZE,
  STEP_SYMBOL_SIZE,
} from '../../../store/reducers/options';

export class TextOptions extends PureComponent {
  state = {};
  render() {
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('font') !== -1 ?
          <ExerciseSelectOption
            name={this.props.translate('text-options.font')}
            value={this.props.options.font}
            options={fontOptions}
            updateValue={value => this.props.onSubmit({ font: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('width') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('text-options.text-width')}
            unit={this.props.translate('text-options.px')}
            value={this.props.options.width}
            min={MIN_TEXT_WIDTH}
            max={MAX_TEXT_WIDTH}
            step={STEP_TEXT_WIDTH}
            updateValue={value => this.props.onSubmit({ width: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('fontSize') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('text-options.font-size')}
            unit={this.props.translate('text-options.pt')}
            value={this.props.options.fontSize}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={STEP_FONT_SIZE}
            updateValue={value => this.props.onSubmit({ fontSize: value })}
          /> : null}
        {this.props.visibleOptions.indexOf('symbolSize') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('text-options.symbol-size')}
            unit={this.props.translate('text-options.percentage')}
            value={this.props.options.symbolSize}
            min={MIN_SYMBOL_SIZE}
            max={MAX_SYMBOL_SIZE}
            step={STEP_SYMBOL_SIZE}
            updateValue={value => this.props.onSubmit({ symbolSize: value })}
          /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options.textOptions,
  visibleOptions: state.options.visibleTextOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.textOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
