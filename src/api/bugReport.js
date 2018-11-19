import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const sendBugReport = bugReportData => (
  new Promise((resolve, reject) => {
    axios.post('/bugReports', bugReportData)
      .then((response) => {
        resolve(serverSuccessMessage(response));
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const fetchBugReports = () => (
  new Promise((resolve, reject) => {
    axios.get('/bugReports')
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);
