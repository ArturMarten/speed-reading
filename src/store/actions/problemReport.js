import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../../shared/utility';

const sendProblemReportStart = () => ({
  type: actionTypes.SEND_PROBLEM_REPORT_START,
});

const sendProblemReportSucceeded = message => ({
  type: actionTypes.SEND_PROBLEM_REPORT_SUCCEEDED,
  payload: message,
});

const sendProblemReportFailed = error => ({
  type: actionTypes.SEND_PROBLEM_REPORT_FAILED,
  payload: error,
});

export const sendProblemReport = problemReportData => (dispatch) => {
  dispatch(sendProblemReportStart());
  axios.post('/problemReports', problemReportData)
    .then((response) => {
      dispatch(sendProblemReportSucceeded(serverSuccessMessage(response)));
    }, (error) => {
      dispatch(sendProblemReportFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(sendProblemReportFailed(error.message));
    });
};

const fetchProblemReportsStart = () => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_START,
});

const fetchProblemReportsSucceeded = problemReports => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_SUCCEEDED,
  payload: problemReports,
});

const fetchProblemReportsFailed = error => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_FAILED,
  payload: error,
});

export const fetchProblemReports = token => (dispatch) => {
  dispatch(fetchProblemReportsStart());
  axios.get('/problemReports', { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchProblemReportsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchProblemReportsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchProblemReportsFailed(error.message));
    });
};
