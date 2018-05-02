import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  token: null,
  userId: null,
  passwordChangeStatus: {
    loading: false,
    message: null,
    error: null,
  },
  authenticationStatus: {
    loading: false,
    error: null,
  },
  registrationStatus: {
    loading: false,
    message: null,
    error: null,
  },
  logoutStatus: {
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START: {
      return updateObject(state, {
        authenticationStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.AUTH_SUCCEEDED: {
      return updateObject(state, {
        token: action.payload.token,
        userId: action.payload.userId,
        authenticationStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.AUTH_FAILED: {
      return updateObject(state, {
        authenticationStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.AUTH_LOGOUT: {
      return updateObject(state, {
        token: null,
        userId: null,
        logoutStatus: {
          error: action.payload,
        },
      });
    }
    case actionTypes.REGISTER_START: {
      return updateObject(state, {
        registrationStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.REGISTER_SUCCEEDED: {
      return updateObject(state, {
        registrationStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.REGISTER_FAILED: {
      return updateObject(state, {
        registrationStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.CHANGE_PASSWORD_START: {
      return updateObject(state, {
        passwordChangeStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_PASSWORD_SUCCEEDED: {
      return updateObject(state, {
        passwordChangeStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.CHANGE_PASSWORD_FAILED: {
      return updateObject(state, {
        passwordChangeStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
