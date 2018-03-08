import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

export const editorStateUpdated = editorState => ({
  type: actionTypes.EDITOR_STATE_UPDATED,
  payload: editorState,
});

const textSaveStart = () => ({
  type: actionTypes.TEXT_SAVE_REQUESTED,
});


const textSaveSucceeded = () => ({
  type: actionTypes.TEXT_SAVE_SUCCEEDED,
});

const textSaveFailed = error => ({
  type: actionTypes.TEXT_SAVE_FAILED,
  error,
});

export const storeText = text => (dispatch) => {
  dispatch(textSaveStart());
  axios.post('/text', text)
    .then((response) => {
      console.log(response);
      dispatch(textSaveSucceeded());
    })
    .catch((error) => {
      dispatch(textSaveFailed(error));
    });
};

const fetchTextsStart = () => ({
  type: actionTypes.FETCH_TEXTS_START,
});

const fetchTextsSucceeded = texts => ({
  type: actionTypes.FETCH_TEXTS_SUCCEEDED,
  texts,
});

const fetchTextsFailed = error => ({
  type: actionTypes.FETCH_TEXTS_FAILED,
  error,
});

export const fetchTexts = () => (dispatch) => {
  dispatch(fetchTextsStart());
  axios.get('/text')
    .then((response) => {
      console.log(response);
      const fetchedTexts = response.data;
      dispatch(fetchTextsSucceeded(fetchedTexts));
    })
    .catch((error) => {
      dispatch(fetchTextsFailed(error));
    });
};

const getTextStart = () => ({
  type: actionTypes.GET_TEXT_START,
});

const getTextSucceeded = text => ({
  type: actionTypes.GET_TEXT_SUCCEEDED,
  text,
});

const getTextFailed = error => ({
  type: actionTypes.GET_TEXT_FAILED,
  error,
});

export const selectText = textId => (dispatch) => {
  dispatch(getTextStart());
  axios.get(`/text/${textId}`)
    .then((response) => {
      const text = response.data;
      dispatch(getTextSucceeded(text));
    })
    .catch((error) => {
      dispatch(getTextFailed(error));
    });
};
