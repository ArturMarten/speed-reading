import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../../shared/utility';

const sendBugReportStart = () => ({
  type: actionTypes.SEND_BUG_REPORT_START,
});

const sendBugReportSucceeded = message => ({
  type: actionTypes.SEND_BUG_REPORT_SUCCEEDED,
  payload: message,
});

const sendBugReportFailed = error => ({
  type: actionTypes.SEND_BUG_REPORT_FAILED,
  payload: error,
});

export const sendBugReport = bugReportData => (dispatch) => {
  dispatch(sendBugReportStart());
  axios.post('/bugReports', bugReportData)
    .then((response) => {
      dispatch(sendBugReportSucceeded(serverSuccessMessage(response)));
    }, (error) => {
      dispatch(sendBugReportFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(sendBugReportFailed(error.message));
    });
};

const fetchBugReportsStart = () => ({
  type: actionTypes.FETCH_BUG_REPORTS_START,
});

const fetchBugReportsSucceeded = bugReports => ({
  type: actionTypes.FETCH_BUG_REPORTS_SUCCEEDED,
  payload: bugReports,
});

const fetchBugReportsFailed = error => ({
  type: actionTypes.FETCH_BUG_REPORTS_FAILED,
  payload: error,
});

export const fetchBugReports = token => (dispatch) => {
  dispatch(fetchBugReportsStart());
  axios.get('/bugReports', { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchBugReportsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchBugReportsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchBugReportsFailed(error.message));
    });
};
