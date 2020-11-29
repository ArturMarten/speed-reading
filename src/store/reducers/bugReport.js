import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  bugReports: [],
  bugReportsStatus: {
    loading: false,
    error: null,
  },
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
    case actionTypes.FETCH_BUG_REPORTS_START: {
      return updateObject(state, {
        bugReportsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_BUG_REPORTS_SUCCEEDED: {
      const bugReports = action.payload.map((bugReport) =>
        updateObject(bugReport, {
          date: bugReport.date ? new Date(bugReport.date) : null,
          loading: false,
        }),
      );
      return updateObject(state, {
        bugReportsStatus: {
          loading: false,
          error: null,
        },
        bugReports,
      });
    }
    case actionTypes.FETCH_BUG_REPORTS_FAILED: {
      return updateObject(state, {
        bugReportsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.RESOLVE_BUG_REPORT_START: {
      return updateObject(state, {
        bugReports: state.bugReports.map((bugReport) =>
          bugReport.id === action.payload.bugReportId ? updateObject(bugReport, { loading: true }) : bugReport,
        ),
      });
    }
    case actionTypes.RESOLVE_BUG_REPORT_SUCCEEDED: {
      return updateObject(state, {
        bugReports: state.bugReports.map((bugReport) =>
          bugReport.id === action.payload.bugReportId
            ? updateObject(bugReport, {
                loading: false,
                resolved: action.payload.resolved,
              })
            : bugReport,
        ),
      });
    }
    case actionTypes.RESOLVE_BUG_REPORT_FAILED: {
      return updateObject(state, {
        bugReports: state.bugReports.map((bugReport) =>
          bugReport.id === action.payload.bugReportId ? updateObject(bugReport, { loading: false }) : bugReport,
        ),
      });
    }
    default:
      return state;
  }
};

export default reducer;
