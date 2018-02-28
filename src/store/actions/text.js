import * as actionTypes from './actionTypes';

export const editorStateUpdated = editorState => ({
  type: actionTypes.EDITOR_STATE_UPDATED,
  payload: editorState,
});

const saveText = () => ({
  type: actionTypes.TEXT_SAVE_REQUESTED,
});


const savedText = () => ({
  type: actionTypes.TEXT_SAVE_SUCCEEDED,
});

export const storeText = () => (dispatch) => {
  dispatch(saveText());
  setTimeout(() => {
    dispatch(savedText());
  }, 2000);
};
