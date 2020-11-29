import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const fetchUserProfile = (userId) =>
  new Promise((resolve, reject) => {
    axios
      .get(`/users/${userId}`)
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

export const saveUserProfile = ({ userId, userProfileData }) =>
  new Promise((resolve, reject) => {
    axios
      .put(`/users/${userId}`, userProfileData)
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
