import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSucceeded = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCEEDED,
    token: token,
    userId: userId
  };
};

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const auth = {
      username: email,
      password: password
    };
    axios.get('/login', {auth: auth})
      .then((response) => {
        console.error(response);
        dispatch(authSucceeded(response.data.token, response.data.userId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((error) => {
        dispatch(authFailed(error.response.data.error));
      });
  };
};

export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};
