import axios from './axios-http';
import { serverErrorMessage } from '../shared/utility';

export const fetchApplicationStatistics = () =>
  new Promise((resolve, reject) => {
    axios
      .get('/applicationStatistics')
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

export const fetchUserExerciseStatistics = (userId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`/exerciseAttempts?userId=${userId}&embed=test`)
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

export const fetchGroupExerciseStatistics = (groupId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`/exerciseAttempts?${groupId != null ? `&groupId=${groupId}&` : ''}groupBy=userId&embed=test`)
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
