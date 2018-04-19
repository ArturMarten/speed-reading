import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

const fetchUsersStart = () => ({
  type: actionTypes.FETCH_USERS_START,
});

const fetchUsersSucceeded = users => ({
  type: actionTypes.FETCH_USERS_SUCCEEDED,
  payload: users,
});

const fetchUsersFailed = error => ({
  type: actionTypes.FETCH_USERS_FAILED,
  payload: error,
});

export const fetchUsers = token => (dispatch) => {
  dispatch(fetchUsersStart());
  axios.get('/users', { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchUsersSucceeded(response.data));
    }, (error) => {
      dispatch(fetchUsersFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchUsersFailed(error.message));
    });
};

const addUserStart = () => ({
  type: actionTypes.ADD_USER_START,
});

const addUserSucceeded = (publicId, userData) => ({
  type: actionTypes.ADD_USER_SUCCEEDED,
  payload: {
    publicId,
    userData,
  },
});

const addUserFailed = error => ({
  type: actionTypes.ADD_USER_FAILED,
  payload: error,
});

export const addUser = (userData, token) => (dispatch) => {
  dispatch(addUserStart());
  axios.post('/users', userData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(addUserSucceeded(response.data.publicId, userData));
    }, (error) => {
      dispatch(addUserFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(addUserFailed(error.message));
    });
};

const changeUserStart = () => ({
  type: actionTypes.CHANGE_USER_START,
});

const changeUserSucceeded = (publicId, userData) => ({
  type: actionTypes.CHANGE_USER_SUCCEEDED,
  payload: {
    publicId,
    userData,
  },
});

const changeUserFailed = error => ({
  type: actionTypes.CHANGE_USER_FAILED,
  payload: error,
});

export const changeUser = (publicId, userData, token) => (dispatch) => {
  dispatch(changeUserStart());
  axios.put(`/users/${publicId}`, userData, { headers: { 'x-access-token': token } })
    .then(() => {
      dispatch(changeUserSucceeded(publicId, userData));
    }, (error) => {
      dispatch(changeUserFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(changeUserFailed(error.message));
    });
};
