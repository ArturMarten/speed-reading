import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import SpeedOptions from '../components/SpeedOptions';
import * as actionCreators from '../store/actions';

const mapStateToProps = (state) => ({
  options: state.exercise.exerciseOptions,
  exerciseType: state.exercise.type,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(actionCreators.exerciseOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedOptions);
