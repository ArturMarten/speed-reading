import {connect} from 'react-redux';
import {getTranslate, getActiveLanguage} from 'react-localize-redux';

import Home from '../components/Home';

const mapStateToProps = (state) => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
