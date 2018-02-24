import * as actionTypes from './actionTypes';

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