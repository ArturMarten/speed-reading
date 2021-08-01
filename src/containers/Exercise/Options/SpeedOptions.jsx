import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseInputOption from '../../../components/Exercise/Options/ExerciseInputOption';

import { MIN_WORDS_PER_MINUTE, MAX_WORDS_PER_MINUTE, STEP_WORDS_PER_MINUTE } from '../../../store/reducers/options';
import ExerciseCheckOption from '../../../components/Exercise/Options/ExerciseCheckOption';

export class SpeedOptions extends PureComponent {
  state = {};

  render() {
    return (
      <Fragment>
        {this.props.visibleOptions.indexOf('manualMode') !== -1 ? (
          <ExerciseCheckOption
            name={this.props.translate('speed-options.manual-mode')}
            description={this.props.translate('speed-options.manual-mode-description')}
            value={this.props.options.manualMode}
            updateValue={(value) => this.props.onSubmit(Object.assign({}, { manualMode: value }))}
          />
        ) : null}
        {this.props.visibleOptions.indexOf('wordsPerMinute') !== -1 ? (
          <ExerciseInputOption
            style={{ visibility: this.props.options.manualMode ? 'hidden' : 'visible' }}
            name={this.props.translate('speed-options.reading-speed')}
            unit={this.props.translate('speed-options.words-per-minute')}
            value={this.props.options.wordsPerMinute}
            min={MIN_WORDS_PER_MINUTE}
            max={MAX_WORDS_PER_MINUTE}
            step={STEP_WORDS_PER_MINUTE}
            updateValue={(value) => this.props.onSubmit(Object.assign({}, { wordsPerMinute: value }))}
            keyboardChangesEnabled
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

export default connect(mapStateToProps, mapDispatchToProps)(SpeedOptions);
