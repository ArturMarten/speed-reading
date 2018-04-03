import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  groupId: null,
  email: null,
  role: null,
  fetching: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PROFILE_START: {
      return updateObject(state, {
        fetching: true,
        error: null,
      });
    }
    case actionTypes.FETCH_USER_PROFILE_SUCCEEDED: {
      return updateObject(state, {
        fetching: false,
        ...action.payload,
      });
    }
    case actionTypes.FETCH_USER_PROFILE_FAILED: {
      return updateObject(state, {
        fetching: false,
        error: action.payload,
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
