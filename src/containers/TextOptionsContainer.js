import {connect} from 'react-redux';

import TextOptions from '../components/TextOptions';
import {optionsUpdated} from '../actions';

const mapStateToProps = (state) => ({
  options: state.exercise.options
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(optionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);