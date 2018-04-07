import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';
import { getCurrentOptions } from '../reducers/options';

const timerInit = () => ({
  type: actionTypes.TIMER_INIT,
});

const timerStart = () => ({
  type: actionTypes.TIMER_START,
});

const timerReset = () => ({
  type: actionTypes.TIMER_RESET,
});

const timerStop = () => ({
  type: actionTypes.TIMER_STOP,
});

const exerciseSelected = type => ({
  type: actionTypes.EXERCISE_SELECT,
  payload: type,
});

const modificationChanged = modification => ({
  type: actionTypes.MODIFICATION_CHANGED,
  payload: modification,
});

const exercisePreparing = () => ({
  type: actionTypes.EXERCISE_PREPARING,
});

const exercisePrepared = (exerciseOptions, selectedText) => ({
  type: actionTypes.EXERCISE_PREPARED,
  payload: {
    exerciseOptions,
    selectedText,
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

const readingExerciseFinished = (elapsedTime, selectedText) => ({
  type: actionTypes.READING_EXERCISE_FINISHED,
  payload: {
    elapsedTime,
    selectedText,
  },
});

const helpExerciseFinished = (elapsedTime, data) => ({
  type: actionTypes.HELP_EXERCISE_FINISHED,
  payload: {
    elapsedTime,
    ...data,
  },
});

const exerciseFinishFailed = error => ({
  type: actionTypes.EXERCISE_FINISH_FAILED,
  payload: error,
});

const exerciseRetry = options => ({
  type: actionTypes.EXERCISE_RETRY,
  payload: options,
});

const exerciseEnd = () => ({
  type: actionTypes.EXERCISE_END,
});

export const selectExercise = type => (dispatch) => {
  dispatch(exerciseSelected(type));
};

export const changeModification = modification => (dispatch) => {
  dispatch(modificationChanged(modification));
};

export const prepareTextExercise = (exerciseOptions, selectedText) => (dispatch) => {
  dispatch(exercisePreparing());
  dispatch(timerInit());
  dispatch(exercisePrepared(exerciseOptions, selectedText));
};

export const prepareHelpExercise = exerciseOptions => (dispatch) => {
  dispatch(exercisePreparing());
  dispatch(timerInit());
  dispatch(exercisePrepared(exerciseOptions));
};

export const startExercise = (attemptData, token) => (dispatch, getState) => {
  dispatch(exerciseStarting());
  const settings = getCurrentOptions(getState().options);
  axios.post('/exerciseAttempts', { ...attemptData, settings }, { headers: { 'x-access-token': token } })
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

export const finishReadingExercise = (attemptId, token) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  dispatch(readingExerciseFinished(elapsedTime, selectedText));
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

export const finishHelpExercise = (attemptId, token, data) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { type } = state.exercise;
  if (type === 'schulteTables') {
    const { tableSize } = state.options.exerciseOptions;
    dispatch(helpExerciseFinished(elapsedTime, { tableSize }));
  } else if (type === 'concentration') {
    dispatch(helpExerciseFinished(elapsedTime, data));
  } else {
    dispatch(helpExerciseFinished(elapsedTime));
  }
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

export const retryExercise = () => (dispatch, getState) => {
  dispatch(timerReset());
  const { exerciseOptions } = getState().options;
  dispatch(exerciseRetry({ exerciseOptions }));
};
export const endExercise = () => (dispatch) => {
  dispatch(exerciseEnd());
};
