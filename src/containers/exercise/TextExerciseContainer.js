import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextExercise from '../../components/exercise/TextExercise';
import {exerciseSelected} from '../../actions';

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
  selectedText: state.exercise.selectedText,
  textOptions: state.exercise.textOptions,
  exerciseOptions: state.exercise.exerciseOptions,
  exerciseState: state.exercise.exerciseState,
  elapsedTime: state.exercise.elapsedTime
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
