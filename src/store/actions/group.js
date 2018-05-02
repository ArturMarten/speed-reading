import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

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

export const fetchGroups = () => (dispatch) => {
  dispatch(fetchGroupsStart());
  axios.get('/groups')
    .then((response) => {
      dispatch(fetchGroupsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchGroupsFailed(serverErrorMessage(error)));
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
      dispatch(addGroupFailed(serverErrorMessage(error)));
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
      dispatch(changeGroupFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(changeGroupFailed(error.message));
    });
};
