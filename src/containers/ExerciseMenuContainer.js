import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import ExerciseMenu from '../components/ExerciseMenu';
import {exerciseSelected, resetRequested} from '../actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(exerciseSelected(type));
    dispatch(resetRequested())
    dispatch(push('/exercise/' + type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseMenu);