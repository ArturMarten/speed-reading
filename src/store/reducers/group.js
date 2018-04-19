import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  groups: [],
  groupsStatus: {
    loading: false,
    error: null,
  },
  groupStatus: {
    loading: false,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GROUPS_START: {
      return updateObject(state, {
        groupsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_GROUPS_SUCCEEDED: {
      return updateObject(state, {
        groupsStatus: {
          loading: false,
          error: null,
        },
        groups: action.payload,
      });
    }
    case actionTypes.FETCH_GROUPS_FAILED: {
      return updateObject(state, {
        groupsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.ADD_GROUP_START: {
      return updateObject(state, {
        groupStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.ADD_GROUP_SUCCEEDED: {
      const newGroup = updateObject(action.payload.groupData, {
        id: action.payload.groupId,
      });
      return updateObject(state, {
        groupStatus: {
          loading: false,
          error: null,
        },
        groups: state.groups.concat(newGroup),
      });
    }
    case actionTypes.ADD_GROUP_FAILED: {
      return updateObject(state, {
        groupStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.CHANGE_GROUP_START: {
      return updateObject(state, {
        groupStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_GROUP_SUCCEEDED: {
      const updatedGroups = state.groups
        .map(group => (group.id === action.payload.groupId ?
          updateObject(group, action.payload.groupData) : group));
      return updateObject(state, {
        groupStatus: {
          loading: false,
          error: null,
        },
        groups: updatedGroups,
      });
    }
    case actionTypes.CHANGE_GROUP_FAILED: {
      return updateObject(state, {
        groupStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
