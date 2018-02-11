import {connect} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

import Login from '../../components/auth/Login';
import * as actionCreators from '../../store/actions';

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  isAuthenticated: state.auth.token !== null,
  error: state.auth.error,
  translate: getTranslate(state.locale)
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (email, password) => {
    dispatch(actionCreators.authLogin(email, password));
  },
  onLogout: () => {
    dispatch(actionCreators.authLogout());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
