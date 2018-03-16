import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  loading: false,
  error: null,
  sent: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_FEEDBACK_START: {
      return updateObject(state, {
        loading: true,
        error: null,
      });
    }
    case actionTypes.SEND_FEEDBACK_SUCCEEDED: {
      return updateObject(state, {
        loading: false,
        error: null,
        sent: true,
      });
    }
    case actionTypes.SEND_FEEDBACK_FAILED: {
      return updateObject(state, {
        error: action.payload.error,
        loading: false,
      });
    }
    default:
      return state;
  }
};

export default reducer;
