import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextOptions from '../components/TextOptions';
import * as actionCreators from '../store/actions';

const mapStateToProps = (state) => ({
  options: state.exercise.textOptions,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (options) => dispatch(actionCreators.textOptionsUpdated(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(TextOptions);
