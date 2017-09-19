import Timing from '../components/Timing';
import {startRequested, stopRequested, resetRequested, tick, fixationUpdated} from '../actions';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  started: state.exercise.started,
  finished: state.exercise.finished,
  fixation: state.exercise.fixation,
  counter: state.exercise.counter
});

const mapDispatchToProps = (dispatch) => ({
  onStart: () => {
    dispatch(startRequested());
  },
  onStop: () => {
    dispatch(stopRequested());
  },
  onReset: () => {
    dispatch(resetRequested());
  },
  onTick: () => {
    dispatch(tick());
  },
  onSubmit: (fixation) => {
    dispatch(fixationUpdated(fixation));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);