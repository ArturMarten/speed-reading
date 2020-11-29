import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const startExercise = (exerciseAttemptData) =>
  new Promise((resolve, reject) => {
    axios
      .post('/exerciseAttempts', exerciseAttemptData)
      .then(
        (response) => {
          resolve(response.data.id);
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });

export const finishExercise = ({ attemptId, result }) =>
  new Promise((resolve, reject) => {
    axios
      .patch(`/exerciseAttempts/${attemptId}`, { result })
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
