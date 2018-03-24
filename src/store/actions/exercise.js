import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

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

const exerciseAttemptStarted = attemptId => ({
  type: actionTypes.EXERCISE_ATTEMPT_START,
  payload: attemptId,
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

export const startExercise = (attemptData, token) => (dispatch) => {
  const isAuthenticated = token !== null;
  if (isAuthenticated) {
    axios.post('/exerciseAttempts', attemptData, { headers: { 'x-access-token': token } })
      .then((response) => {
        dispatch(timerStart());
        dispatch(exerciseStarted());
        dispatch(exerciseAttemptStarted(response.data.id));
      }, (error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    dispatch(timerStart());
    dispatch(exerciseStarted());
  }
};

export const finishExercise = (attemptId, token) => (dispatch, getState) => {
  dispatch(timerStop());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  dispatch(exerciseFinished(elapsedTime, selectedText));
  state = getState();
  const { result } = state.exercise;
  axios.patch(`/exerciseAttempts/${attemptId}`, { result }, { headers: { 'x-access-token': token } })
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    })
    .catch((error) => {
      console.log(error);
    });
};
