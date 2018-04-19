import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  users: [],
  usersStatus: {
    loading: false,
    error: null,
  },
  userStatus: {
    loading: false,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USERS_START: {
      return updateObject(state, {
        usersStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USERS_SUCCEEDED: {
      const users = action.payload.map(user => updateObject(user, {
        registrationDate: user.registrationDate ? new Date(user.registrationDate) : null,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      }));
      return updateObject(state, {
        usersStatus: {
          loading: false,
          error: null,
        },
        users,
      });
    }
    case actionTypes.FETCH_USERS_FAILED: {
      return updateObject(state, {
        usersStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.ADD_USER_START: {
      return updateObject(state, {
        userStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.ADD_USER_SUCCEEDED: {
      const newUser = updateObject(action.payload.userData, {
        publicId: action.payload.publicId,
        registrationDate: new Date(),
      });
      return updateObject(state, {
        userStatus: {
          loading: false,
          error: null,
        },
        users: state.users.concat(newUser),
      });
    }
    case actionTypes.ADD_USER_FAILED: {
      return updateObject(state, {
        userStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.CHANGE_USER_START: {
      return updateObject(state, {
        userStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_USER_SUCCEEDED: {
      const updatedUsers = state.users
        .map(user => (user.publicId === action.payload.publicId ?
          updateObject(user, action.payload.userData) : user));
      return updateObject(state, {
        userStatus: {
          loading: false,
          error: null,
        },
        users: updatedUsers,
      });
    }
    case actionTypes.CHANGE_USER_FAILED: {
      return updateObject(state, {
        userStatus: {
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
