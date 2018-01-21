import {connect} from 'react-redux';
import {push} from 'connected-react-router';

import ExerciseMenu from '../components/ExerciseMenu';
import * as actionCreators from '../store/actions';

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.resetRequested());
    dispatch(push('/exercise/' + type));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseMenu);
