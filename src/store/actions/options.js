import * as actionTypes from './actionTypes';

export const textOptionsUpdated = options => ({
  type: actionTypes.TEXT_OPTIONS_UPDATED,
  payload: options,
});

export const exerciseOptionsUpdated = options => ({
  type: actionTypes.EXERCISE_OPTIONS_UPDATED,
  payload: options,
});

export const speedOptionsUpdated = options => ({
  type: actionTypes.SPEED_OPTIONS_UPDATED,
  payload: options,
});
