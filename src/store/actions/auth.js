import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import * as api from '../../api';

const registerStart = () => ({
  type: actionTypes.REGISTER_START,
});

const registerSucceeded = (message) => ({
  type: actionTypes.REGISTER_SUCCEEDED,
  payload: message,
});

const registerFailed = (error) => ({
  type: actionTypes.REGISTER_FAILED,
  payload: error,
});

export const register = (registerData) => (dispatch) => {
  dispatch(registerStart());
  api.register(registerData).then(
    (message) => {
      dispatch(registerSucceeded(message));
    },
    (errorMessage) => {
      dispatch(registerFailed(errorMessage));
    },
  );
};

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

const authFailed = (error) => ({
  type: actionTypes.AUTH_FAILED,
  payload: error,
});

export const logout = (error) => {
  api.saveToken(null);
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT,
    payload: error,
  };
};

const checkAuthTimeout = (expirationTime) => (dispatch) => {
  // console.log(`Logging out in ${expirationTime}s`);
  setTimeout(() => {
    dispatch(logout('Authentication expired'));
  }, expirationTime * 1000);
};

export const login = (username, password) => (dispatch) => {
  dispatch(authStart());
  api.login({ username, password }).then(
    (data) => {
      const { token, userId, expiresIn } = data;
      api.saveToken(token);
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('expirationDate', expirationDate);
      dispatch(authSucceeded(token, userId));
      dispatch(checkAuthTimeout(expiresIn));
      dispatch(actionCreators.fetchUserProfile(userId));
      dispatch(actionCreators.fetchExerciseStatistics(userId));
    },
    (errorMessage) => {
      dispatch(authFailed(errorMessage));
    },
  );
};

export const authCheckState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  if (!token) {
    api.saveToken(null);
    dispatch(logout(null));
  } else {
    api.saveToken(token);
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    const now = new Date();
    if (expirationDate <= now) {
      dispatch(logout('Authentication expired'));
    } else {
      dispatch(authStart());
      const userId = localStorage.getItem('userId');
      const expiresIn = (expirationDate.getTime() - new Date().getTime()) / 1000;
      dispatch(authSucceeded(token, userId));
      dispatch(checkAuthTimeout(expiresIn));
      dispatch(actionCreators.fetchUserProfile(userId));
      dispatch(actionCreators.fetchExerciseStatistics(userId));
    }
  }
};

const changePasswordStart = () => ({
  type: actionTypes.CHANGE_PASSWORD_START,
});

const changePasswordSucceeded = (message) => ({
  type: actionTypes.CHANGE_PASSWORD_SUCCEEDED,
  payload: message,
});

const changePasswordFailed = (error) => ({
  type: actionTypes.CHANGE_PASSWORD_FAILED,
  payload: error,
});

export const changePassword = (oldPassword, newPassword) => (dispatch) => {
  dispatch(changePasswordStart());
  api.changePassword({ oldPassword, newPassword }).then(
    (message) => {
      dispatch(changePasswordSucceeded(message));
    },
    (errorMessage) => {
      dispatch(changePasswordFailed(errorMessage));
    },
  );
};
