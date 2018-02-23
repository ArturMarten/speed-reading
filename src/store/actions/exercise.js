import * as actionTypes from './actionTypes';

export const editorStateUpdated = (editorState) => {
  return {
    type: actionTypes.EDITOR_STATE_UPDATED,
    payload: editorState
  };
};

export const textOptionsUpdated = (options) => {
  return {
    type: actionTypes.TEXT_OPTIONS_UPDATED,
    payload: options
  };
};

export const exerciseOptionsUpdated = (options) => {
  return {
    type: actionTypes.EXERCISE_OPTIONS_UPDATED,
    payload: options
  };
};

export const exerciseSelected = (type) => {
  return {
    type: actionTypes.EXERCISE_SELECTED,
    payload: type
  };
};

export const exerciseFinished = () => {
  return {
    type: actionTypes.EXERCISE_FINISHED
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
