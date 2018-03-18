import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  users: [],
  groups: [],
  loading: false,
  fetchedUsers: false,
  fetchedGroups: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_START: {
      return updateObject(state, {
        loading: true,
        error: null,
      });
    }
    case actionTypes.FETCH_USERS_SUCCEEDED: {
      return updateObject(state, {
        loading: !state.fetchedGroups,
        fetchedUsers: true,
        error: null,
        users: action.payload,
      });
    }
    case actionTypes.FETCH_USERS_FAILED: {
      return updateObject(state, {
        error: action.payload.error,
        loading: false,
      });
    }
    case actionTypes.ADD_USER_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.ADD_USER_SUCCEEDED: {
      const newUser = updateObject(action.payload.userData, {
        publicId: action.payload.publicId,
        registrationDate: new Date(),
      });
      return updateObject(state, {
        users: state.users.concat(newUser),
      });
    }
    case actionTypes.ADD_USER_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_USER_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_USER_SUCCEEDED: {
      const updatedUsers = state.users
        .map(user => (user.publicId === action.payload.publicId ?
          updateObject(user, action.payload.userData) : user));
      return updateObject(state, {
        users: updatedUsers,
      });
    }
    case actionTypes.CHANGE_USER_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.FETCH_GROUPS_START: {
      return updateObject(state, {
        loading: true,
        error: null,
      });
    }
    case actionTypes.FETCH_GROUPS_SUCCEEDED: {
      return updateObject(state, {
        loading: !state.fetchedUsers,
        fetchedGroups: true,
        error: null,
        groups: action.payload,
      });
    }
    case actionTypes.FETCH_GROUPS_FAILED: {
      return updateObject(state, {
        error: action.payload.error,
        loading: false,
      });
    }
    case actionTypes.ADD_GROUP_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.ADD_GROUP_SUCCEEDED: {
      const newGroup = updateObject(action.payload.groupData, {
        id: action.payload.groupId,
      });
      return updateObject(state, {
        groups: state.groups.concat(newGroup),
      });
    }
    case actionTypes.ADD_GROUP_FAILED: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_GROUP_START: {
      return updateObject(state, {
      });
    }
    case actionTypes.CHANGE_GROUP_SUCCEEDED: {
      const updatedGroups = state.groups
        .map(group => (group.id === action.payload.groupId ?
          updateObject(group, action.payload.groupData) : group));
      return updateObject(state, {
        groups: updatedGroups,
      });
    }
    case actionTypes.CHANGE_GROUP_FAILED: {
      return updateObject(state, {
      });
    }
    default:
      return state;
  }
};

export default reducer;
