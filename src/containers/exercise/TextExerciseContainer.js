import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextExercise from '../../components/exercise/TextExercise';
import * as actionCreators from '../../store/actions';

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
    dispatch(actionCreators.exerciseSelected(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
