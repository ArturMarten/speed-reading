export const START_REQUESTED = 'START_REQUESTED';
export const STOP_REQUESTED = 'STOP_REQUESTED';
export const RESET_REQUESTED = 'RESET_REQUESTED';
export const TICK = 'TICK';
export const EDITOR_STATE_UPDATED = 'EDITOR_STATE_UPDATED';
export const TEXT_OPTIONS_UPDATED = 'TEXT_OPTIONS_UPDATED';
export const EXERCISE_OPTIONS_UPDATED = 'EXERCISE_OPTIONS_UPDATED';
export const EXERCISE_SELECTED = 'EXERCISE_SELECTED';

export const startRequested = () => ({
  type: START_REQUESTED
});

export const stopRequested = () => ({
  type: STOP_REQUESTED
});

export const resetRequested = () => ({
  type: RESET_REQUESTED
});

export const tick = () => ({
  type: TICK
});

export const editorStateUpdated = (editorState) => ({
  type: EDITOR_STATE_UPDATED,
  payload: editorState
});

export const textOptionsUpdated = (options) => ({
  type: TEXT_OPTIONS_UPDATED,
  payload: options
});

export const exerciseOptionsUpdated = (options) => ({
  type: EXERCISE_OPTIONS_UPDATED,
  payload: options
});

export const exerciseSelected = (type) => ({
  type: EXERCISE_SELECTED,
  payload: type
});