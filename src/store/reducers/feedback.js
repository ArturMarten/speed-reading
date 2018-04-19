import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  feedbackList: [],
  feedbackListStatus: {
    loading: false,
    error: null,
  },
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
    case actionTypes.FETCH_FEEDBACK_START: {
      return updateObject(state, {
        feedbackListStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_FEEDBACK_SUCCEEDED: {
      const feedbackList = action.payload.map(feedback => updateObject(feedback, {
        date: feedback.date ? new Date(feedback.date) : null,
        userId: (feedback.userId === null ? '' : feedback.userId),
      }));
      return updateObject(state, {
        feedbackListStatus: {
          loading: false,
          error: null,
        },
        feedbackList,
      });
    }
    case actionTypes.FETCH_FEEDBACK_FAILED: {
      return updateObject(state, {
        feedbackListStatus: {
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
