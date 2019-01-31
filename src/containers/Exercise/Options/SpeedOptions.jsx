import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

import {
  MIN_WORDS_PER_MINUTE,
  MAX_WORDS_PER_MINUTE,
  STEP_WORDS_PER_MINUTE,
  MIN_FIXATION,
  MAX_FIXATION,
  STEP_FIXATION,
} from '../../../store/reducers/options';

export class SpeedOptions extends PureComponent {
  state = {};

  componentDidMount() {
    document.addEventListener('keypress', this.keyPressHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.keyPressHandler);
  }

  keyPressHandler = (event) => {
    const { keyCode } = event;
    const key = String.fromCharCode(keyCode);
    if (key === '+') {
      if (this.wordsPerMinuteSpeedRef) {
        this.wordsPerMinuteSpeedRef.increaseHandler(event);
      } else if (this.fixationSpeedRef) {
        this.fixationSpeedRef.decreaseHandler(event);
      }
    } else if (key === '-') {
      if (this.wordsPerMinuteSpeedRef) {
        this.wordsPerMinuteSpeedRef.decreaseHandler(event);
      } else if (this.fixationSpeedRef) {
        this.fixationSpeedRef.increaseHandler(event);
      }
    }
  };

  render() {
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('wordsPerMinute') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('speed-options.reading-speed')}
            unit={this.props.translate('speed-options.words-per-minute')}
            value={this.props.options.wordsPerMinute}
            min={MIN_WORDS_PER_MINUTE}
            max={MAX_WORDS_PER_MINUTE}
            step={STEP_WORDS_PER_MINUTE}
            updateValue={(value) => this.props.onSubmit(Object.assign({}, { wordsPerMinute: value }))}
            ref={(ref) => {
              this.wordsPerMinuteSpeedRef = ref;
            }}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('fixation') !== -1 ? (
          <ExerciseInputOption
            name={this.props.translate('speed-options.fixation-time')}
            unit={this.props.translate('speed-options.ms')}
            value={this.props.options.fixation}
            min={MIN_FIXATION}
            max={MAX_FIXATION}
            step={STEP_FIXATION}
            updateValue={(value) => this.props.onSubmit({ fixation: value })}
            ref={(ref) => {
              this.fixationSpeedRef = ref;
            }}
          />
        ) : null}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  options: state.options.speedOptions,
  visibleOptions: state.options.visibleSpeedOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (option) => dispatch(actionCreators.speedOptionUpdated(option)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpeedOptions);
