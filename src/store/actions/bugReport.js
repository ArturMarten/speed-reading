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

export default sendBugReport;
