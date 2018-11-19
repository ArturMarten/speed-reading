import * as actionTypes from './actionTypes';
import * as api from '../../api';

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

export const saveText = (text, textId) => (dispatch) => {
  dispatch(saveTextStart());
  api.saveText({ text, textId })
    .then((message) => {
      dispatch(saveTextSucceeded(text, message));
    }, (errorMessage) => {
      dispatch(saveTextFailed(errorMessage));
    });
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
  api.fetchTextCollections()
    .then((textCollections) => {
      dispatch(fetchTextCollectionsSucceeded(textCollections));
    }, (errorMessage) => {
      dispatch(fetchTextCollectionsFailed(errorMessage));
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
  api.fetchTexts()
    .then((texts) => {
      dispatch(fetchTextsSucceeded(texts));
    }, (errorMessage) => {
      dispatch(fetchTextsFailed(errorMessage));
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
  api.selectText(textId)
    .then((text) => {
      dispatch(fetchReadingTextSucceeded(text));
    }, (errorMessage) => {
      dispatch(fetchReadingTextFailed(errorMessage));
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
  api.analyzeText({ text: textData.plainText, language: textData.language })
    .then((analysis) => {
      dispatch(selectOwnTextSucceeded({ ...textData, ...analysis }));
    }, (errorMessage) => {
      dispatch(selectOwnTextFailed(errorMessage));
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
  api.analyzeText(textData)
    .then((analysis) => {
      dispatch(analyzeTextSucceeded(analysis));
    }, (errorMessage) => {
      dispatch(analyzeTextFailed(errorMessage));
    });
};
