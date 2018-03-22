import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

const MIN_WPM = 10;
const MAX_WPM = 500;
const MIN_FIXATION = 20;
const MAX_FIXATION = 500;

export class SpeedOptions extends Component {
  state = {};
  render() {
    if (this.props.exerciseType === 'reading' || this.props.exerciseType === 'disappearing') {
      return (
        <Fragment>
          <ExerciseInputOption
            name={this.props.translate('speed-options.reading-speed')}
            unit={this.props.translate('speed-options.wpm')}
            value={this.props.options.wpm}
            min={MIN_WPM}
            max={MAX_WPM}
            step={10}
            updateValue={value => this.props.onSubmit(Object.assign({}, { wpm: value }))}
          />
        </Fragment>
      );
    } else if (this.props.exerciseType === 'wordGroup') {
      return (
        <Fragment>
          <ExerciseInputOption
            name={this.props.translate('speed-options.fixation-time')}
            unit={this.props.translate('speed-options.ms')}
            value={this.props.options.fixation}
            min={MIN_FIXATION}
            max={MAX_FIXATION}
            step={10}
            updateValue={value => this.props.onSubmit({ fixation: value })}
          />
        </Fragment>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  options: state.options.speedOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.speedOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedOptions);
