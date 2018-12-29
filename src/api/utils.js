import axios from './axios-http';
import { serverErrorMessage } from '../shared/utility';

export const exportFile = ({ filename, filetype, columns, rows, headings }) => {
  const config = {
    responseType: 'arraybuffer',
  };
  return new Promise((resolve, reject) => {
    axios.post('exportFile', { filename, filetype, columns, rows, headings }, config)
      .then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(serverErrorMessage(error));
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export default exportFile;
