import Timing from '../components/Timing';
import {startRequested, pauseRequested, resetRequested, finishRequested} from '../actions';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  exerciseState: state.exercise.exerciseState,
  counter: state.exercise.counter
});

const mapDispatchToProps = (dispatch) => ({
  onStart: () => {
    dispatch(startRequested());
  },
  onPause: () => {
    dispatch(pauseRequested());
  },
  onReset: () => {
    dispatch(resetRequested());
  },
  onFinish: () => {
    dispatch(finishRequested());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);
