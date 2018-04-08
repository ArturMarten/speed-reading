import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

import {
  MIN_WPM,
  MAX_WPM,
  STEP_WPM,
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
      if (this.wpmSpeedRef) {
        this.wpmSpeedRef.increaseHandler(event);
      } else if (this.fixationSpeedRef) {
        this.fixationSpeedRef.decreaseHandler(event);
      }
    } else if (key === '-') {
      if (this.wpmSpeedRef) {
        this.wpmSpeedRef.decreaseHandler(event);
      } else if (this.fixationSpeedRef) {
        this.fixationSpeedRef.increaseHandler(event);
      }
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('wpm') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('speed-options.reading-speed')}
            unit={this.props.translate('speed-options.wpm')}
            value={this.props.options.wpm}
            min={MIN_WPM}
            max={MAX_WPM}
            step={STEP_WPM}
            updateValue={value => this.props.onSubmit(Object.assign({}, { wpm: value }))}
            ref={(ref) => { this.wpmSpeedRef = ref; }}
          /> : null}
        {this.props.visibleOptions.indexOf('fixation') !== -1 ?
          <ExerciseInputOption
            name={this.props.translate('speed-options.fixation-time')}
            unit={this.props.translate('speed-options.ms')}
            value={this.props.options.fixation}
            min={MIN_FIXATION}
            max={MAX_FIXATION}
            step={STEP_FIXATION}
            updateValue={value => this.props.onSubmit({ fixation: value })}
            ref={(ref) => { this.fixationSpeedRef = ref; }}
          /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options.speedOptions,
  visibleOptions: state.options.visibleSpeedOptions,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onSubmit: option => dispatch(actionCreators.speedOptionUpdated(option)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedOptions);
