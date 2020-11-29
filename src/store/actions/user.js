import * as actionTypes from './actionTypes';
import * as api from '../../api';

const fetchUsersStart = () => ({
  type: actionTypes.FETCH_USERS_START,
});

const fetchUsersSucceeded = (users) => ({
  type: actionTypes.FETCH_USERS_SUCCEEDED,
  payload: users,
});

const fetchUsersFailed = (error) => ({
  type: actionTypes.FETCH_USERS_FAILED,
  payload: error,
});

export const fetchUsers = () => (dispatch) => {
  dispatch(fetchUsersStart());
  api.fetchUsers().then(
    (users) => {
      dispatch(fetchUsersSucceeded(users));
    },
    (errorMessage) => {
      dispatch(fetchUsersFailed(errorMessage));
    },
  );
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

const addUserFailed = (error) => ({
  type: actionTypes.ADD_USER_FAILED,
  payload: error,
});

export const addUser = (userData) => (dispatch) => {
  dispatch(addUserStart());
  api.addUser(userData).then(
    (userPublicId) => {
      dispatch(addUserSucceeded(userPublicId, userData));
    },
    (errorMessage) => {
      dispatch(addUserFailed(errorMessage));
    },
  );
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

const changeUserFailed = (error) => ({
  type: actionTypes.CHANGE_USER_FAILED,
  payload: error,
});

export const changeUser = (publicId, userData) => (dispatch) => {
  dispatch(changeUserStart());
  api
    .changeUser({ publicId, userData })
    .then(
      () => {
        dispatch(changeUserSucceeded(publicId, userData));
      },
      (errorMessage) => {
        dispatch(changeUserFailed(errorMessage));
      },
    )
    .catch((error) => {
      dispatch(changeUserFailed(error.message));
    });
};
