import * as actionTypes from './actionTypes';

export const editorStateUpdated = (editorState) => {
  return {
    type: actionTypes.EDITOR_STATE_UPDATED,
    payload: editorState
  };
};

export const storeText = () => {
  return (dispatch) => {
    dispatch(saveText());
    setTimeout(() => {
      dispatch(savedText());
    }, 2000);
  };
};

const saveText = () => {
  return {
    type: actionTypes.TEXT_SAVE_REQUESTED
  };
};


const savedText = () => {
  return {
    type: actionTypes.TEXT_SAVE_SUCCEEDED
  };
};