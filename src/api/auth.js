import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const register = registerData => (
  new Promise((resolve, reject) => {
    axios.post('/register', registerData)
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

export const login = ({ username, password }) => (
  new Promise((resolve, reject) => {
    axios.get('/login', { auth: { username, password } })
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

export const saveToken = (token) => {
  if (token === null) {
    delete axios.defaults.headers.common['x-access-token'];
  } else {
    axios.defaults.headers.common['x-access-token'] = token;
  }
};

export const changePassword = ({ oldPassword, newPassword }) => (
  new Promise((resolve, reject) => {
    const auth = { password: `${oldPassword}_${newPassword}` };
    axios.get('/changePassword', { auth })
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
