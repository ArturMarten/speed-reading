import {connect} from 'react-redux';

import ReadingWithStyle from '../../components/exercise/ReadingWithStyle';
import {exerciseSelected, finishRequested} from '../../actions';

const mapStateToProps = (state) => ({
  content: state.exercise.content,
  textOptions: state.exercise.textOptions,
  exerciseOptions: state.exercise.exerciseOptions,
  exerciseState: state.exercise.exerciseState,
  elapsedTime: state.exercise.elapsedTime
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  },
  onExerciseFinish: () => {
    dispatch(finishRequested());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReadingWithStyle);
