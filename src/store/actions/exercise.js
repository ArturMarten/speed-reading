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
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  const isAuthenticated = token !== null;
  dispatch(exerciseFinished(elapsedTime, selectedText));
  if (isAuthenticated) {
    state = getState();
    const { result } = state.exercise;
    axios.patch(`/exerciseAttempts/${attemptId}`, { result }, { headers: { 'x-access-token': token } })
      .then(() => {
        // Dispatch event
      }, (error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const endExercise = () => (dispatch) => {
  dispatch(exerciseEnd());
};
