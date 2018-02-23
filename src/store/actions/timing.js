import * as actionTypes from './actionTypes';

export const startRequested = () => {
  return {
    type: actionTypes.TIMER_START
  };
};

export const pauseRequested = () => {
  return {
    type: actionTypes.TIMER_PAUSE
  };
};

export const resumeRequested = () => {
  return {
    type: actionTypes.TIMER_RESUME
  };
};

export const resetRequested = () => {
  return {
    type: actionTypes.TIMER_RESET
  };
};

export const stopRequested = () => {
  return {
    type: actionTypes.TIMER_STOP
  };
};