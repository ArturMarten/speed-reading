import {connect} from 'react-redux';

import OneGroupVisible from '../../components/exercise/OneGroupVisible';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

export default connect(mapStateToProps, undefined)(OneGroupVisible);