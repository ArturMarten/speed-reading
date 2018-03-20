import * as actionTypes from './actionTypes';

const timerInit = () => ({
  type: actionTypes.TIMER_INIT,
});

const timerStart = () => ({
  type: actionTypes.TIMER_START,
});

const timerStop = () => ({
  type: actionTypes.TIMER_STOP,
});

const exerciseSelected = type => ({
  type: actionTypes.EXERCISE_SELECT,
  payload: type,
});

const exercisePrepared = (selectedText, exerciseOptions) => ({
  type: actionTypes.EXERCISE_PREPARE,
  payload: {
    selectedText,
    exerciseOptions,
  },
});

const exerciseStarted = () => ({
  type: actionTypes.EXERCISE_START,
});

const exerciseFinished = (elapsedTime, selectedText) => ({
  type: actionTypes.EXERCISE_FINISH,
  payload: {
    elapsedTime,
    selectedText,
  },
});

export const selectExercise = type => (dispatch) => {
  dispatch(exerciseSelected(type));
};

export const prepareExercise = (selectedText, exerciseOptions) => (dispatch) => {
  dispatch(timerInit());
  dispatch(exercisePrepared(selectedText, exerciseOptions));
};

export const startExercise = () => (dispatch) => {
  dispatch(timerStart());
  dispatch(exerciseStarted());
};

export const finishExercise = () => (dispatch, getState) => {
  dispatch(timerStop());
  const state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  dispatch(exerciseFinished(elapsedTime, selectedText));
};
