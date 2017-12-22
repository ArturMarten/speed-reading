import {connect} from 'react-redux';

import Disappearing from '../../components/exercise/Disappearing';
import {exerciseSelected} from '../../actions';

const mapStateToProps = (state) => ({
  text: state.exercise.text,
  width: state.exercise.textOptions.width,
  fontSize: state.exercise.textOptions.fontSize,
  wpm: state.exercise.exerciseOptions.wpm,
  started: state.exercise.started,
  resetted: state.exercise.resetted
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Disappearing);
