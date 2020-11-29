import * as actionTypes from './actionTypes';

export const textOptionUpdated = (option) => ({
  type: actionTypes.TEXT_OPTION_UPDATED,
  payload: option,
});

export const exerciseOptionUpdated = (option) => ({
  type: actionTypes.EXERCISE_OPTION_UPDATED,
  payload: option,
});

export const speedOptionUpdated = (option) => ({
  type: actionTypes.SPEED_OPTION_UPDATED,
  payload: option,
});

export const resetTextOptions = () => ({
  type: actionTypes.RESET_TEXT_OPTIONS,
});

export const resetExerciseOptions = () => ({
  type: actionTypes.RESET_EXERCISE_OPTIONS,
});
