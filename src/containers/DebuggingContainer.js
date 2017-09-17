import Debugging from '../components/Debugging';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

export default connect(mapStateToProps, undefined)(Debugging);