import * as actionTypes from './actionTypes';
import * as api from '../../api';

const sendProblemReportStart = () => ({
  type: actionTypes.SEND_PROBLEM_REPORT_START,
});

const sendProblemReportSucceeded = (message) => ({
  type: actionTypes.SEND_PROBLEM_REPORT_SUCCEEDED,
  payload: message,
});

const sendProblemReportFailed = (error) => ({
  type: actionTypes.SEND_PROBLEM_REPORT_FAILED,
  payload: error,
});

export const sendProblemReport = (problemReportData) => (dispatch) => {
  dispatch(sendProblemReportStart());
  api.sendProblemReport(problemReportData).then(
    (message) => {
      dispatch(sendProblemReportSucceeded(message));
    },
    (errorMessage) => {
      dispatch(sendProblemReportFailed(errorMessage));
    },
  );
};

const fetchProblemReportsStart = () => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_START,
});

const fetchProblemReportsSucceeded = (problemReports) => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_SUCCEEDED,
  payload: problemReports,
});

const fetchProblemReportsFailed = (error) => ({
  type: actionTypes.FETCH_PROBLEM_REPORTS_FAILED,
  payload: error,
});

export const fetchProblemReports = () => (dispatch) => {
  dispatch(fetchProblemReportsStart());
  api.fetchProblemReports().then(
    (problemReports) => {
      dispatch(fetchProblemReportsSucceeded(problemReports));
    },
    (errorMessage) => {
      dispatch(fetchProblemReportsFailed(errorMessage));
    },
  );
};

const resolveProblemReportStart = (problemReportId) => ({
  type: actionTypes.RESOLVE_PROBLEM_REPORT_START,
  payload: {
    problemReportId,
  },
});

const resolveProblemReportSucceeded = (problemReportId, resolved) => ({
  type: actionTypes.RESOLVE_PROBLEM_REPORT_SUCCEEDED,
  payload: {
    problemReportId,
    resolved,
  },
});

const resolveProblemReportFailed = (problemReportId, errorMessage) => ({
  type: actionTypes.RESOLVE_PROBLEM_REPORT_FAILED,
  payload: {
    problemReportId,
    errorMessage,
  },
});

export const resolveProblemReport = (problemReportId, resolved) => (dispatch) => {
  dispatch(resolveProblemReportStart(problemReportId));
  api.resolveProblemReport(problemReportId, resolved).then(
    () => {
      dispatch(resolveProblemReportSucceeded(problemReportId, resolved));
    },
    (errorMessage) => {
      dispatch(resolveProblemReportFailed(problemReportId, errorMessage));
    },
  );
};
