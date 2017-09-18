import {connect} from 'react-redux';

import OneGroupVisible from '../../components/exercise/OneGroupVisible';
import {exerciseSelected} from '../../actions';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OneGroupVisible);