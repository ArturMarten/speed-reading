import {connect} from 'react-redux';

import Debugging from '../components/Debugging';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

export default connect(mapStateToProps, undefined)(Debugging);
