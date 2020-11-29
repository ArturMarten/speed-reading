import * as actionTypes from './actionTypes';
import * as api from '../../api';

const fetchGroupsStart = () => ({
  type: actionTypes.FETCH_GROUPS_START,
});

const fetchGroupsSucceeded = (groups) => ({
  type: actionTypes.FETCH_GROUPS_SUCCEEDED,
  payload: groups,
});

const fetchGroupsFailed = (error) => ({
  type: actionTypes.FETCH_GROUPS_FAILED,
  payload: error,
});

export const fetchGroups = () => (dispatch) => {
  dispatch(fetchGroupsStart());
  api.fetchGroups().then(
    (groups) => {
      dispatch(fetchGroupsSucceeded(groups));
    },
    (errorMessage) => {
      dispatch(fetchGroupsFailed(errorMessage));
    },
  );
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

const addGroupFailed = (error) => ({
  type: actionTypes.ADD_GROUP_FAILED,
  payload: error,
});

export const addGroup = (groupData) => (dispatch) => {
  dispatch(addGroupStart());
  api.addGroup(groupData).then(
    (groupId) => {
      dispatch(addGroupSucceeded(groupId, groupData));
    },
    (errorMessage) => {
      dispatch(addGroupFailed(errorMessage));
    },
  );
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

const changeGroupFailed = (error) => ({
  type: actionTypes.CHANGE_GROUP_FAILED,
  payload: error,
});

export const changeGroup = (groupId, groupData) => (dispatch) => {
  dispatch(changeGroupStart());
  api.changeGroup({ groupId, groupData }).then(
    () => {
      dispatch(changeGroupSucceeded(groupId, groupData));
    },
    (errorMessage) => {
      dispatch(changeGroupFailed(errorMessage));
    },
  );
};
