import {connect} from 'react-redux';

import Disappearing from '../../components/exercise/Disappearing';
import {exerciseSelected} from '../../actions';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Disappearing);