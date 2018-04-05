import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  feedbackStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_FEEDBACK_START: {
      return updateObject(state, {
        feedbackStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SEND_FEEDBACK_SUCCEEDED: {
      return updateObject(state, {
        feedbackStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.SEND_FEEDBACK_FAILED: {
      return updateObject(state, {
        feedbackStatus: {
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
