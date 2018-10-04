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
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  profileStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PROFILE_START: {
      return updateObject(state, {
        profileStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USER_PROFILE_SUCCEEDED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
          error: null,
        },
        ...action.payload,
        firstName: action.payload.firstName !== null ? action.payload.firstName : '',
        lastName: action.payload.lastName !== null ? action.payload.lastName : '',
      });
    }
    case actionTypes.FETCH_USER_PROFILE_FAILED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.SAVE_USER_PROFILE_START: {
      return updateObject(state, {
        profileStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SAVE_USER_PROFILE_SUCCEEDED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
        ...action.payload.userProfile,
      });
    }
    case actionTypes.SAVE_USER_PROFILE_FAILED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
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
