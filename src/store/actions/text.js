import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

const textSaveStart = () => ({
  type: actionTypes.TEXT_SAVE_START,
});

const textSaveSucceeded = () => ({
  type: actionTypes.TEXT_SAVE_SUCCEEDED,
});

const textSaveFailed = error => ({
  type: actionTypes.TEXT_SAVE_FAILED,
  payload: error,
});

export const storeText = (text, textId) => (dispatch) => {
  dispatch(textSaveStart());
  if (textId) {
    axios.put(`/texts/${textId}`, text)
      .then((response) => {
        console.log(response);
        dispatch(textSaveSucceeded());
      })
      .catch((error) => {
        dispatch(textSaveFailed(error.message));
      });
  } else {
    axios.post('/texts', text)
      .then((response) => {
        console.log(response);
        dispatch(textSaveSucceeded());
      })
      .catch((error) => {
        dispatch(textSaveFailed(error.message));
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
    })
    .catch((error) => {
      console.log(error);
      dispatch(fetchTextsFailed(error.message));
    });
};


const getTextStart = () => ({
  type: actionTypes.GET_TEXT_START,
});

const getTextSucceeded = text => ({
  type: actionTypes.GET_TEXT_SUCCEEDED,
  payload: text,
});

const getTextFailed = error => ({
  type: actionTypes.GET_TEXT_FAILED,
  payload: error,
});

export const selectText = textId => (dispatch) => {
  dispatch(getTextStart());
  axios.get(`/texts/${textId}`)
    .then((response) => {
      const text = response.data;
      dispatch(getTextSucceeded(text));
    }, (error) => {
      console.log(error);
    })
    .catch((error) => {
      dispatch(getTextFailed(error.message));
    });
};

export const unselectText = () => ({
  type: actionTypes.UNSELECT_TEXT,
});
