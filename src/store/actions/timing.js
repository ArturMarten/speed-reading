import * as actionTypes from './actionTypes';

export const startRequested = () => ({
  type: actionTypes.TIMER_START,
});

export const pauseRequested = () => ({
  type: actionTypes.TIMER_PAUSE,
});

export const resumeRequested = () => ({
  type: actionTypes.TIMER_RESUME,
});

export const resetRequested = () => ({
  type: actionTypes.TIMER_RESET,
});

export const stopRequested = () => ({
  type: actionTypes.TIMER_STOP,
});
