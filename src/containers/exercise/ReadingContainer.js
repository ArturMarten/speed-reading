import {connect} from 'react-redux';

import Reading from '../../components/exercise/Reading';
import {exerciseSelected} from '../../actions';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Reading);