import {connect} from 'react-redux';

import Reading from '../../components/exercise/Reading';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

export default connect(mapStateToProps, undefined)(Reading);