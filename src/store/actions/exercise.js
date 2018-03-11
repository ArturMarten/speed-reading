import * as actionTypes from './actionTypes';

export const exerciseSelected = type => ({
  type: actionTypes.EXERCISE_SELECTED,
  payload: type,
});

export const prepareExercise = (text, characterCount) => ({
  type: actionTypes.PREPARE_EXERCISE,
  payload: {
    text,
    characterCount,
  },
});

export const exerciseFinished = () => ({
  type: actionTypes.EXERCISE_FINISHED,
});
