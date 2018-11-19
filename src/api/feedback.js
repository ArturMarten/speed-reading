import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const sendFeedback = feedbackData => (
  new Promise((resolve, reject) => {
    axios.post('/feedback', feedbackData)
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

export const fetchFeedback = () => (
  new Promise((resolve, reject) => {
    axios.get('/feedback')
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
