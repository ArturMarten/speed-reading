import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseSelectOption from '../../../components/Exercise/Options/ExerciseSelectOption';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

const MIN_TEXT_WIDTH = 250;
const MAX_TEXT_WIDTH = 1000;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;

export class TextOptions extends Component {
  state = {};
  render() {
    const fontOptions = [
      { text: 'Arial', value: 'Arial' },
      { text: 'Calibri', value: 'Calibri' },
      { text: 'Comic Sans MS', value: 'Comic Sans MS' },
      { text: 'Courier New', value: 'Courier New' },
      { text: 'Garamond', value: 'Garamond' },
      { text: 'Georgia', value: 'Georgia' },
      { text: 'Impact', value: 'Impact' },
      { text: 'Times New Roman', value: 'Times New Roman' },
      { text: 'Trebuchet MS', value: 'Trebuchet MS' },
      { text: 'Verdana', value: 'Verdana' },
      { text: 'Serif', value: 'serif' },
      { text: 'Sans-serif', value: 'sans-serif' },
    ];
    return (
      <Fragment>
        <ExerciseSelectOption
          name={this.props.translate('text-options.font')}
          value={this.props.options.font}
          options={fontOptions}
          updateValue={value => this.props.onSubmit({ font: value })}
        />
        <ExerciseInputOption
          name={this.props.translate('text-options.text-width')}
          unit={this.props.translate('text-options.px')}
          value={this.props.options.width}
          min={MIN_TEXT_WIDTH}
          max={MAX_TEXT_WIDTH}
          step={50}
          updateValue={value => this.props.onSubmit({ width: value })}
        />
        <ExerciseInputOption
          name={this.props.translate('text-options.font-size')}
          unit={this.props.translate('text-options.pt')}
          value={this.props.options.fontSize}
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          step={1}
          updateValue={value => this.props.onSubmit({ fontSize: value })}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options.textOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.textOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
