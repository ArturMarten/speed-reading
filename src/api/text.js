import axios from './axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../shared/utility';

export const saveText = ({ text, textId }) => (
  new Promise((resolve, reject) => {
    if (textId) {
      axios.put(`/texts/${textId}`, text)
        .then((response) => {
          resolve(serverSuccessMessage(response));
        }, (error) => {
          reject(serverErrorMessage(error));
        })
        .catch((error) => {
          reject(error.message);
        });
    } else {
      axios.post('/texts', text)
        .then((response) => {
          resolve(serverSuccessMessage(response));
        }, (error) => {
          reject(serverErrorMessage(error));
        })
        .catch((error) => {
          reject(error.message);
        });
    }
  })
);

export const fetchTextCollections = () => (
  new Promise((resolve, reject) => {
    axios.get('/collections')
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

export const fetchTexts = () => (
  new Promise((resolve, reject) => {
    axios.get('/texts')
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

export const selectText = textId => (
  new Promise((resolve, reject) => {
    axios.get(`/texts/${textId}`)
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

export const analyzeText = ({ text, language }) => (
  new Promise((resolve, reject) => {
    axios.post('/analyze', { text, language })
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

export const addTextRating = ratingData => (
  new Promise((resolve, reject) => {
    axios.post('/textRatings', ratingData)
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
