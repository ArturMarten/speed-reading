import Timing from '../components/Timing';
import {startRequested, stopRequested, resetRequested} from '../actions';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  started: state.exercise.started
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);