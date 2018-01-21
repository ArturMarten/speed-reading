import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import Disappearing from '../../components/exercise/Disappearing';
import * as actionCreators from '../../store/actions';

const mapStateToProps = (state) => ({
  selectedText: state.exercise.selectedText,
  textOptions: state.exercise.textOptions,
  exerciseOptions: state.exercise.exerciseOptions,
  exerciseState: state.exercise.exerciseState,
  elapsedTime: state.exercise.elapsedTime,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseFinish: () => {
    dispatch(actionCreators.finishRequested());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Disappearing);
