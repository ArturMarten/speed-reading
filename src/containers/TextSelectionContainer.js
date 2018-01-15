import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import TextSelection from '../components/TextSelection';

const mapStateToProps = (state) => ({
  selectedText: state.selectedText,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelection);
