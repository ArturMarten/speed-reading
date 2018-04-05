import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import axios from '../../axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../../shared/utility';

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

export const authLogout = (error) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT,
    payload: error,
  };
};

const checkAuthTimeout = expirationTime => (dispatch) => {
  // console.log(`Logging out in ${expirationTime}s`);
  setTimeout(() => {
    dispatch(authLogout('Authentication expired'));
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
      dispatch(actionCreators.fetchUserProfile(response.data.userId, response.data.token));
    }, (error) => {
      dispatch(authFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(authFailed(error.message));
    });
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    dispatch(authLogout(null));
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      dispatch(authLogout('Authentication expired'));
    } else {
      dispatch(authStart());
      const userId = localStorage.getItem('userId');
      dispatch(authSucceeded(token, userId));
      dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      dispatch(actionCreators.fetchUserProfile(userId, token));
    }
  }
};

const changePasswordStart = () => ({
  type: actionTypes.CHANGE_PASSWORD_START,
});

const changePasswordSucceeded = message => ({
  type: actionTypes.CHANGE_PASSWORD_SUCCEEDED,
  payload: message,
});

const changePasswordFailed = error => ({
  type: actionTypes.CHANGE_PASSWORD_FAILED,
  payload: error,
});

export const changePassword = (oldPassword, newPassword, token) => (dispatch) => {
  dispatch(changePasswordStart());
  const auth = {
    password: `${oldPassword}_${newPassword}`,
  };
  axios.get('/changePassword', { auth, headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(changePasswordSucceeded(serverSuccessMessage(response)));
    }, (error) => {
      dispatch(changePasswordFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(changePasswordFailed(error.message));
    });
};
