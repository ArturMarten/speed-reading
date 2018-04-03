import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  authenticationError: null,
  changePasswordError: null,
  authenticating: false,
  changingPassword: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: {
      return updateObject(state, {
        authenticating: true,
        authenticationError: null,
      });
    }
    case actionTypes.AUTH_SUCCEEDED: {
      return updateObject(state, {
        token: action.payload.token,
        userId: action.payload.userId,
        authenticating: false,
        authenticationError: null,
      });
    }
    case actionTypes.AUTH_FAILED: {
      return updateObject(state, {
        authenticating: false,
        authenticationError: action.payload,
      });
    }
    case actionTypes.AUTH_LOGOUT: {
      return updateObject(state, {
        token: null,
        userId: null,
        authenticationError: action.payload,
      });
    }
    case actionTypes.CHANGE_PASSWORD_START: {
      return updateObject(state, {
        changingPassword: true,
        changePasswordError: null,
      });
    }
    case actionTypes.CHANGE_PASSWORD_SUCCEEDED: {
      return updateObject(state, {
        changingPassword: false,
        changePasswordError: null,
      });
    }
    case actionTypes.CHANGE_PASSWORD_FAILED: {
      return updateObject(state, {
        changingPassword: false,
        changePasswordError: action.payload,
      });
    }
    default:
      return state;
  }
};

export default reducer;
