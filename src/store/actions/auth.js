import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSucceeded = (token, userId) => ({
  type: actionTypes.AUTH_SUCCEEDED,
  payload: {
    token,
    userId,
  },
});

export const authFailed = error => ({
  type: actionTypes.AUTH_FAILED,
  payload: error,
});

export const authLogout = () => ({
  type: actionTypes.AUTH_LOGOUT,
});

export const checkAuthTimeout = expirationTime => (dispatch) => {
  setTimeout(() => {
    dispatch(authLogout());
  }, expirationTime * 1000);
};

export const authLogin = (email, password) => (dispatch) => {
  dispatch(authStart());
  const auth = {
    username: email,
    password,
  };
  axios.get('/login', { auth })
    .then((response) => {
      dispatch(authSucceeded(response.data.token, response.data.userId));
      dispatch(checkAuthTimeout(response.data.expiresIn));
    }, (error) => {
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(authFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(authFailed(error.message));
    });
};
