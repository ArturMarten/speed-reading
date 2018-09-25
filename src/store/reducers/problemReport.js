import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  problemReports: [],
  problemReportsStatus: {
    loading: false,
    error: null,
  },
  problemReportStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEND_PROBLEM_REPORT_START: {
      return updateObject(state, {
        problemReportStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SEND_PROBLEM_REPORT_SUCCEEDED: {
      return updateObject(state, {
        problemReportStatus: {
          loading: false,
          message: action.payload,
          error: null,
        },
      });
    }
    case actionTypes.SEND_PROBLEM_REPORT_FAILED: {
      return updateObject(state, {
        problemReportStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.FETCH_PROBLEM_REPORTS_START: {
      return updateObject(state, {
        problemReportsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_PROBLEM_REPORTS_SUCCEEDED: {
      const problemReports = action.payload.map(problemReport => updateObject(problemReport, {
        date: problemReport.date ? new Date(problemReport.date) : null,
      }));
      return updateObject(state, {
        problemReportsStatus: {
          loading: false,
          error: null,
        },
        problemReports,
      });
    }
    case actionTypes.FETCH_PROBLEM_REPORTS_FAILED: {
      return updateObject(state, {
        problemReportsStatus: {
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
