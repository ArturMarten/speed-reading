import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextOptions from '../components/TextOptions';
import {textOptionsUpdated} from '../actions';

const mapStateToProps = (state) => ({
  options: state.exercise.textOptions,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(textOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
