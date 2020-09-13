import axios from './axios-http';
import { serverErrorMessage } from '../shared/utility';

export const fetchAchievements = () =>
  new Promise((resolve, reject) => {
    axios
      .get(`/achievements`)
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

export default fetchAchievements;
