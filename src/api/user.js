import axios from './axios-http';
import { serverErrorMessage } from '../shared/utility';

export const fetchUsers = () =>
  new Promise((resolve, reject) => {
    axios
      .get('/users')
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

export const addUser = (userData) =>
  new Promise((resolve, reject) => {
    axios
      .post('/users', userData)
      .then(
        (response) => {
          resolve(response.data.publicId);
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });

export const changeUser = ({ publicId, userData }) =>
  new Promise((resolve, reject) => {
    axios
      .put(`/users/${publicId}`, userData)
      .then(
        () => {
          resolve();
        },
        (error) => {
          reject(serverErrorMessage(error));
        },
      )
      .catch((error) => {
        reject(error.message);
      });
  });
