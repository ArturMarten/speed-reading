import {connect} from 'react-redux';

import Disappearing from '../../components/exercise/Disappearing';

const mapStateToProps = (state) => ({
  exercise: state.exercise
});

export default connect(mapStateToProps, undefined)(Disappearing);