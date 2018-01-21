import Timing from '../components/Timing';
import * as actionCreators from '../store/actions';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  exerciseState: state.exercise.exerciseState,
  counter: state.exercise.counter
});

const mapDispatchToProps = (dispatch) => ({
  onStart: () => {
    dispatch(actionCreators.startRequested());
  },
  onPause: () => {
    dispatch(actionCreators.pauseRequested());
  },
  onReset: () => {
    dispatch(actionCreators.resetRequested());
  },
  onFinish: () => {
    dispatch(actionCreators.finishRequested());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Timing);
