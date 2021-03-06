import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const sendProblemReport = (problemReportData) =>
  new Promise((resolve, reject) => {
    axios
      .post('/problemReports', problemReportData)
      .then(
        (response) => {
          resolve(serverSuccessMessage(response));
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });

export const fetchProblemReports = () =>
  new Promise((resolve, reject) => {
    axios
      .get('/problemReports')
      .then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });

export const resolveProblemReport = (problemReportId, resolved) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`/problemReports/${problemReportId}`, { resolved })
      .then(
        (response) => {
          resolve(serverSuccessMessage(response));
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });
