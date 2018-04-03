import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

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
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(fetchUsersFailed(errorMessage));
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
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(addUserFailed(errorMessage));
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
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(changeUserFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(changeUserFailed(error.message));
    });
};

const fetchGroupsStart = () => ({
  type: actionTypes.FETCH_GROUPS_START,
});

const fetchGroupsSucceeded = groups => ({
  type: actionTypes.FETCH_GROUPS_SUCCEEDED,
  payload: groups,
});

const fetchGroupsFailed = error => ({
  type: actionTypes.FETCH_GROUPS_FAILED,
  payload: error,
});

export const fetchGroups = token => (dispatch) => {
  dispatch(fetchGroupsStart());
  axios.get('/groups', { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchGroupsSucceeded(response.data));
    }, (error) => {
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(fetchGroupsFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(fetchGroupsFailed(error.message));
    });
};

const addGroupStart = () => ({
  type: actionTypes.ADD_GROUP_START,
});

const addGroupSucceeded = (groupId, groupData) => ({
  type: actionTypes.ADD_GROUP_SUCCEEDED,
  payload: {
    groupId,
    groupData,
  },
});

const addGroupFailed = error => ({
  type: actionTypes.ADD_GROUP_FAILED,
  payload: error,
});

export const addGroup = (groupData, token) => (dispatch) => {
  dispatch(addGroupStart());
  axios.post('/groups', groupData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(addGroupSucceeded(response.data.id, groupData));
    }, (error) => {
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(addGroupFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(addGroupFailed(error.message));
    });
};

const changeGroupStart = () => ({
  type: actionTypes.CHANGE_GROUP_START,
});

const changeGroupSucceeded = (groupId, groupData) => ({
  type: actionTypes.CHANGE_GROUP_SUCCEEDED,
  payload: {
    groupId,
    groupData,
  },
});

const changeGroupFailed = error => ({
  type: actionTypes.CHANGE_GROUP_FAILED,
  payload: error,
});

export const changeGroup = (groupId, groupData, token) => (dispatch) => {
  dispatch(changeGroupStart());
  axios.put(`/groups/${groupId}`, groupData, { headers: { 'x-access-token': token } })
    .then(() => {
      dispatch(changeGroupSucceeded(groupId, groupData));
    }, (error) => {
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(changeGroupFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(changeGroupFailed(error.message));
    });
};
