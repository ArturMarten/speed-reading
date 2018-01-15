import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextPreview from '../components/TextPreview';

const mapStateToProps = (state) => ({
  textOptions: state.exercise.textOptions,
  exerciseOptions: state.exercise.exerciseOptions,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextPreview);
