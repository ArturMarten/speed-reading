import * as actionTypes from './actionTypes';

export const startRequested = () => {
  return {
    type: actionTypes.START_REQUESTED
  };
};

export const pauseRequested = () => {
  return {
    type: actionTypes.PAUSE_REQUESTED
  };
};

export const resetRequested = () => {
  return {
    type: actionTypes.RESET_REQUESTED
  };
};

export const finishRequested = () => {
  return {
    type: actionTypes.FINISH_REQUESTED
  };
};

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
