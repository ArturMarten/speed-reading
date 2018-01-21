import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import ExerciseOptions from '../components/ExerciseOptions';
import * as actionCreators from '../store/actions';

const mapStateToProps = (state) => ({
  options: state.exercise.exerciseOptions,
  exerciseType: state.exercise.type,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(actionCreators.exerciseOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseOptions);
