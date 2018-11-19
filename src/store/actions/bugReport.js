import * as actionTypes from './actionTypes';
import * as api from '../../api';

const sendBugReportStart = () => ({
  type: actionTypes.SEND_BUG_REPORT_START,
});

const sendBugReportSucceeded = message => ({
  type: actionTypes.SEND_BUG_REPORT_SUCCEEDED,
  payload: message,
});

const sendBugReportFailed = errorMessage => ({
  type: actionTypes.SEND_BUG_REPORT_FAILED,
  payload: errorMessage,
});

export const sendBugReport = bugReportData => (dispatch) => {
  dispatch(sendBugReportStart());
  api.sendBugReport(bugReportData)
    .then((message) => {
      dispatch(sendBugReportSucceeded(message));
    }, (errorMessage) => {
      dispatch(sendBugReportFailed(errorMessage));
    });
};

const fetchBugReportsStart = () => ({
  type: actionTypes.FETCH_BUG_REPORTS_START,
});

const fetchBugReportsSucceeded = bugReports => ({
  type: actionTypes.FETCH_BUG_REPORTS_SUCCEEDED,
  payload: bugReports,
});

const fetchBugReportsFailed = errorMessage => ({
  type: actionTypes.FETCH_BUG_REPORTS_FAILED,
  payload: errorMessage,
});

export const fetchBugReports = () => (dispatch) => {
  dispatch(fetchBugReportsStart());
  api.fetchBugReports()
    .then((data) => {
      dispatch(fetchBugReportsSucceeded(data));
    }, (errorMessage) => {
      dispatch(fetchBugReportsFailed(errorMessage));
    });
};
