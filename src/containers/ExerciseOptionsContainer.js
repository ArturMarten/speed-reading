import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import ExerciseOptions from '../components/ExerciseOptions';
import {exerciseOptionsUpdated} from '../actions';

const mapStateToProps = (state) => ({
  options: state.exercise.exerciseOptions,
  exerciseType: state.exercise.type,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(exerciseOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
