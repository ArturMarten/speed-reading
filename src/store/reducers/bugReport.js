import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  bugReportStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_BUG_REPORT_START: {
      return updateObject(state, {
        bugReportStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SEND_BUG_REPORT_SUCCEEDED: {
      return updateObject(state, {
        bugReportStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.SEND_BUG_REPORT_FAILED: {
      return updateObject(state, {
        bugReportStatus: {
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
