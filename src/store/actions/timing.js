import * as actionTypes from './actionTypes';

export const startTimer = () => ({
  type: actionTypes.TIMER_START,
});

export const pauseTimer = () => ({
  type: actionTypes.TIMER_PAUSE,
});

export const resumeTimer = () => ({
  type: actionTypes.TIMER_RESUME,
});

export const resetTimer = () => ({
  type: actionTypes.TIMER_RESET,
});

export const stopTimer = () => ({
  type: actionTypes.TIMER_STOP,
});
