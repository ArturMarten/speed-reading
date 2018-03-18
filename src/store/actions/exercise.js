import * as actionTypes from './actionTypes';

export const exerciseSelected = type => ({
  type: actionTypes.EXERCISE_SELECTED,
  payload: type,
});

export const prepareExercise = (selectedText, exerciseOptions) => ({
  type: actionTypes.PREPARE_EXERCISE,
  payload: {
    selectedText,
    exerciseOptions,
  },
});

export const exerciseFinished = () => ({
  type: actionTypes.EXERCISE_FINISHED,
});
