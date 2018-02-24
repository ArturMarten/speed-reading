import * as actionTypes from './actionTypes';

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

export const speedOptionsUpdated = (options) => {
  return {
    type: actionTypes.SPEED_OPTIONS_UPDATED,
    payload: options
  };
};