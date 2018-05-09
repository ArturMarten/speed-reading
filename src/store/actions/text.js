import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage, serverSuccessMessage } from '../../shared/utility';

const saveTextStart = () => ({
  type: actionTypes.SAVE_TEXT_START,
});

const saveTextSucceeded = (text, message) => ({
  type: actionTypes.SAVE_TEXT_SUCCEEDED,
  payload: {
    text,
    message,
  },
});

const saveTextFailed = error => ({
  type: actionTypes.SAVE_TEXT_FAILED,
  payload: error,
});

export const saveText = (text, textId, token) => (dispatch) => {
  dispatch(saveTextStart());
  if (textId) {
    axios.put(`/texts/${textId}`, text, { headers: { 'x-access-token': token } })
      .then((response) => {
        dispatch(saveTextSucceeded(text, serverSuccessMessage(response)));
      }, (error) => {
        dispatch(saveTextFailed(serverErrorMessage(error)));
      })
      .catch((error) => {
        dispatch(saveTextFailed(error.message));
      });
  } else {
    axios.post('/texts', text, { headers: { 'x-access-token': token } })
      .then((response) => {
        dispatch(saveTextSucceeded(text, serverSuccessMessage(response)));
      }, (error) => {
        dispatch(saveTextFailed(serverErrorMessage(error)));
      })
      .catch((error) => {
        dispatch(saveTextFailed(error.message));
      });
  }
};

const fetchTextCollectionsStart = () => ({
  type: actionTypes.FETCH_TEXT_COLLECTIONS_START,
});

const fetchTextCollectionsSucceeded = collections => ({
  type: actionTypes.FETCH_TEXT_COLLECTIONS_SUCCEEDED,
  payload: collections,
});

const fetchTextCollectionsFailed = error => ({
  type: actionTypes.FETCH_TEXT_COLLECTIONS_FAILED,
  payload: error,
});

export const fetchTextCollections = () => (dispatch) => {
  dispatch(fetchTextCollectionsStart());
  axios.get('/collections')
    .then((response) => {
      const fetchedTextCollections = response.data;
      dispatch(fetchTextCollectionsSucceeded(fetchedTextCollections));
    }, (error) => {
      dispatch(fetchTextCollectionsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchTextCollectionsFailed(error.message));
    });
};

const fetchTextsStart = () => ({
  type: actionTypes.FETCH_TEXTS_START,
});

const fetchTextsSucceeded = texts => ({
  type: actionTypes.FETCH_TEXTS_SUCCEEDED,
  payload: texts,
});

const fetchTextsFailed = error => ({
  type: actionTypes.FETCH_TEXTS_FAILED,
  payload: error,
});

export const fetchTexts = () => (dispatch) => {
  dispatch(fetchTextsStart());
  axios.get('/texts')
    .then((response) => {
      const fetchedTexts = response.data;
      dispatch(fetchTextsSucceeded(fetchedTexts));
    }, (error) => {
      dispatch(fetchTextsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchTextsFailed(error.message));
    });
};

const fetchReadingTextStart = () => ({
  type: actionTypes.FETCH_READING_TEXT_START,
});

const fetchReadingTextSucceeded = text => ({
  type: actionTypes.FETCH_READING_TEXT_SUCCEEDED,
  payload: text,
});

const fetchReadingTextFailed = error => ({
  type: actionTypes.FETCH_READING_TEXT_FAILED,
  payload: error,
});

export const selectText = textId => (dispatch) => {
  dispatch(fetchReadingTextStart());
  axios.get(`/texts/${textId}`)
    .then((response) => {
      const text = response.data;
      dispatch(fetchReadingTextSucceeded(text));
    }, (error) => {
      dispatch(fetchReadingTextFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchReadingTextFailed(error.message));
    });
};

const selectOwnTextStart = () => ({
  type: actionTypes.SELECT_OWN_TEXT_START,
});

const selectOwnTextSucceeded = text => ({
  type: actionTypes.SELECT_OWN_TEXT_SUCCEEDED,
  payload: text,
});

const selectOwnTextFailed = error => ({
  type: actionTypes.SELECT_OWN_TEXT_FAILED,
  payload: error,
});

export const selectOwnText = textData => (dispatch) => {
  dispatch(selectOwnTextStart());
  axios.post('/analyze', { text: textData.plain })
    .then((response) => {
      const analysis = response.data;
      dispatch(selectOwnTextSucceeded({ ...textData, ...analysis }));
    }, (error) => {
      dispatch(selectOwnTextFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(selectOwnTextFailed(error.message));
    });
};

export const unselectText = () => ({
  type: actionTypes.UNSELECT_TEXT,
});

const analyzeTextStart = () => ({
  type: actionTypes.ANALYZE_TEXT_START,
});

const analyzeTextSucceeded = analysis => ({
  type: actionTypes.ANALYZE_TEXT_SUCCEEDED,
  payload: analysis,
});

const analyzeTextFailed = error => ({
  type: actionTypes.ANALYZE_TEXT_FAILED,
  payload: error,
});

export const analyzeText = textData => (dispatch) => {
  dispatch(analyzeTextStart());
  axios.post('/analyze', textData)
    .then((response) => {
      const analysis = response.data;
      dispatch(analyzeTextSucceeded(analysis));
    }, (error) => {
      dispatch(analyzeTextFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(analyzeTextFailed(error.message));
    });
};
