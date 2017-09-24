import {connect} from 'react-redux';

import TextOptions from '../components/TextOptions';
import {textOptionsUpdated} from '../actions';

const mapStateToProps = (state) => ({
  options: state.exercise.textOptions
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(textOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);