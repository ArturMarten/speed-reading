import axios from './axios-http';
import { serverErrorMessage } from '../shared/utility';

export const fetchGroups = () => (
  new Promise((resolve, reject) => {
    axios.get('/groups')
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

export const addGroup = groupData => (
  new Promise((resolve, reject) => {
    axios.post('/groups', groupData)
      .then((response) => {
        resolve(response.data.id);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);

export const changeGroup = ({ groupId, groupData }) => (
  new Promise((resolve, reject) => {
    axios.put(`/groups/${groupId}`, groupData)
      .then(() => {
        resolve();
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  })
);
