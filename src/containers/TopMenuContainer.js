import {connect} from 'react-redux';
import {getTranslate, getLanguages, getActiveLanguage, setActiveLanguage} from 'react-localize-redux';

import TopMenu from '../components/TopMenu';
import {startRequested, stopRequested, resetRequested} from '../actions';

const mapStateToProps = (state) => ({
  currentLanguage: getActiveLanguage(state.locale).code,
  languages: getLanguages(state.locale),
  translate: getTranslate(state.locale),
  path: state.router.location.pathname
});

const mapDispatchToProps = (dispatch) => ({
  onSettingLanguage: (code) => {
    dispatch(setActiveLanguage(code));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);