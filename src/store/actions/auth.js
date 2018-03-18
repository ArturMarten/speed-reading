import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

const authStart = () => ({
  type: actionTypes.AUTH_START,
});

const authSucceeded = (token, userId) => ({
  type: actionTypes.AUTH_SUCCEEDED,
  payload: {
    token,
    userId,
  },
});

const authFailed = error => ({
  type: actionTypes.AUTH_FAILED,
  payload: error,
});

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

const checkAuthTimeout = expirationTime => (dispatch) => {
  // console.log(`Logging out in ${expirationTime}s`);
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
      const expirationDate = new Date(new Date().getTime() + (response.data.expiresIn * 1000));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('expirationDate', expirationDate);
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

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(authLogout());
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(authLogout());
    } else {
      const userId = localStorage.getItem('userId');
      dispatch(authSucceeded(token, userId));
      dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
};
