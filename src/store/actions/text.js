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
