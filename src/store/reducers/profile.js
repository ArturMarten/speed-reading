import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

export const rolePermissions = {
  guest: 0,
  student: 1,
  editor: 2,
  teacher: 3,
  developer: 4,
  admin: 5,
};

const initialState = {
  groupId: null,
  email: null,
  role: null,
  profileStatus: {
    loading: false,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PROFILE_START: {
      return updateObject(state, {
        profileStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USER_PROFILE_SUCCEEDED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          error: null,
        },
        ...action.payload,
      });
    }
    case actionTypes.FETCH_USER_PROFILE_FAILED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.AUTH_LOGOUT: {
      return updateObject(state, {
        ...initialState,
      });
    }
    default:
      return state;
  }
};

export default reducer;
