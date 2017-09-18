export const START_REQUESTED = 'START_REQUESTED';
export const STOP_REQUESTED = 'STOP_REQUESTED';
export const RESET_REQUESTED = 'RESET_REQUESTED';
export const TICK = 'TICK';
export const EDITOR_STATE_UPDATED = 'EDITOR_STATE_UPDATED';
export const OPTIONS_UPDATED = 'OPTIONS_UPDATED';
export const EXERCISE_SELECTED = 'EXERCISE_SELECTED';
export const FIXATION_UPDATED = 'FIXATION_UPDATED';

export const startRequested = () => (dispatch) => {
  dispatch({type: START_REQUESTED});
};

export const stopRequested = () => {
  return {
    type: STOP_REQUESTED
  };
};

export const resetRequested = () => {
  return {
    type: RESET_REQUESTED
  }
}

export const tick = () => ({
  type: TICK
});

export const editorStateUpdated = (editorState) => ({
  type: EDITOR_STATE_UPDATED,
  payload: editorState
});

export const optionsUpdated = (options) => ({
  type: OPTIONS_UPDATED,
  payload: options
});

export const exerciseSelected = (type) => ({
  type: EXERCISE_SELECTED,
  payload: type
});

export const fixationUpdated = (fixation) => ({
  type: FIXATION_UPDATED,
  payload: fixation
});
