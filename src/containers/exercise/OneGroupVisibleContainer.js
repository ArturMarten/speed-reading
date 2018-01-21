import {connect} from 'react-redux';

import OneGroupVisible from '../../components/exercise/OneGroupVisible';
import * as actionCreators from '../../store/actions';

const mapStateToProps = (state) => ({
  text: state.exercise.text,
  wordGroups: state.exercise.wordGroups,
  width: state.exercise.textOptions.width,
  fontSize: state.exercise.textOptions.fontSize,
  fixation: state.exercise.exerciseOptions.fixation,
  started: state.exercise.started,
  resetted: state.exercise.resetted
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OneGroupVisible);
