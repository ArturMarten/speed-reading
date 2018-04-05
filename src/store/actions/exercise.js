import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

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

const exercisePreparing = () => ({
  type: actionTypes.EXERCISE_PREPARING,
});

const exercisePrepared = (selectedText, exerciseOptions) => ({
  type: actionTypes.EXERCISE_PREPARED,
  payload: {
    selectedText,
    exerciseOptions,
  },
});

const exerciseStarting = () => ({
  type: actionTypes.EXERCISE_STARTING,
});

const exerciseStarted = () => ({
  type: actionTypes.EXERCISE_STARTED,
});

const exerciseStartFailed = error => ({
  type: actionTypes.EXERCISE_START_FAILED,
  payload: error,
});

const exerciseAttemptStarted = attemptId => ({
  type: actionTypes.EXERCISE_ATTEMPT_START,
  payload: attemptId,
});

const exerciseFinishing = () => ({
  type: actionTypes.EXERCISE_FINISHING,
});

const exerciseFinished = (elapsedTime, selectedText) => ({
  type: actionTypes.EXERCISE_FINISHED,
  payload: {
    elapsedTime,
    selectedText,
  },
});

const exerciseFinishFailed = error => ({
  type: actionTypes.EXERCISE_FINISH_FAILED,
  payload: error,
});

const exerciseEnd = () => ({
  type: actionTypes.EXERCISE_END,
});

export const selectExercise = type => (dispatch) => {
  dispatch(exerciseSelected(type));
};

export const prepareExercise = (selectedText, exerciseOptions) => (dispatch) => {
  dispatch(exercisePreparing());
  dispatch(timerInit());
  dispatch(exercisePrepared(selectedText, exerciseOptions));
};

export const startExercise = (attemptData, token) => (dispatch) => {
  dispatch(exerciseStarting());
  axios.post('/exerciseAttempts', attemptData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(timerStart());
      dispatch(exerciseStarted());
      dispatch(exerciseAttemptStarted(response.data.id));
    }, (error) => {
      dispatch(exerciseStartFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(exerciseStartFailed(error.message));
    });
};

export const finishExercise = (attemptId, token) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  dispatch(exerciseFinished(elapsedTime, selectedText));
  state = getState();
  const { result } = state.exercise;
  axios.patch(`/exerciseAttempts/${attemptId}`, { result }, { headers: { 'x-access-token': token } })
    .then(() => {
      // Dispatch event
    }, (error) => {
      dispatch(exerciseFinishFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(exerciseFinishFailed(error.message));
    });
};

export const endExercise = () => (dispatch) => {
  dispatch(exerciseEnd());
};
