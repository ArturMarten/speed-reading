import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import * as api from '../../api';
import { getCurrentOptions } from '../reducers/options';
import { exerciseAttemptMap } from '../reducers/statistics';
import { calculateAchievements, diffAchievements } from '../../containers/Achievements/achievements';

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

const exerciseSelected = (type) => ({
  type: actionTypes.EXERCISE_SELECT,
  payload: type,
});

const modificationChanged = (modification) => ({
  type: actionTypes.MODIFICATION_CHANGED,
  payload: modification,
});

const exercisePreparing = () => ({
  type: actionTypes.EXERCISE_PREPARING,
});

const exercisePrepared = (save, exerciseOptions, selectedText) => ({
  type: actionTypes.EXERCISE_PREPARED,
  payload: {
    save,
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

const exerciseStartFailed = (error) => ({
  type: actionTypes.EXERCISE_START_FAILED,
  payload: error,
});

const exerciseAttemptStarted = (attempt) => ({
  type: actionTypes.EXERCISE_ATTEMPT_START,
  payload: attempt,
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

const exerciseFinishFailed = (error) => ({
  type: actionTypes.EXERCISE_FINISH_FAILED,
  payload: error,
});

const exerciseRetry = (options) => ({
  type: actionTypes.EXERCISE_RETRY,
  payload: options,
});

const exerciseEnd = () => ({
  type: actionTypes.EXERCISE_END,
});

const updateAchievements = (dispatch, state) => {
  // Get statistics, current attempt and achievements
  const { achievements } = state.profile;
  const { exerciseStatistics } = state.statistics;
  const attempt = exerciseAttemptMap(state.exercise.attempt);
  // Calculate new achievements & diff
  // console.log('Calculating achievements with new attempt', attempt);
  const newAchievements = calculateAchievements(achievements, exerciseStatistics, attempt);
  const diff = diffAchievements(achievements, newAchievements);
  // console.log('Updated achievements', newAchievements);
  // console.log('Achievements diff', diff);
  // Save attempt to statistics

  dispatch(actionCreators.updateAchievements(newAchievements, diff));
};

export const selectExercise = (type) => (dispatch) => {
  dispatch(exerciseSelected(type));
};

export const changeModification = (modification) => (dispatch) => {
  dispatch(modificationChanged(modification));
};

export const prepareTextExercise = (save, exerciseOptions, selectedText) => (dispatch) => {
  dispatch(exercisePreparing());
  dispatch(timerInit());
  dispatch(exercisePrepared(save, exerciseOptions, selectedText));
};

export const prepareHelpExercise = (save, exerciseOptions) => (dispatch) => {
  dispatch(exercisePreparing());
  dispatch(timerInit());
  dispatch(exercisePrepared(save, exerciseOptions));
};

export const startExercise = (attemptData) => (dispatch, getState) => {
  dispatch(exerciseStarting());
  const settings = getCurrentOptions(getState().options);
  const attempt = { ...attemptData, settings };
  api.startExercise(attempt).then(
    (attemptId) => {
      dispatch(timerStart());
      dispatch(exerciseStarted());
      dispatch(exerciseAttemptStarted({ ...attempt, id: attemptId }));
    },
    (errorMessage) => {
      dispatch(exerciseStartFailed(errorMessage));
    },
  );
};

export const finishReadingExercise = (attemptId) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { selectedText } = state.text;
  dispatch(readingExerciseFinished(elapsedTime, selectedText));
  state = getState();
  const { result } = state.exercise;
  api.finishExercise({ attemptId, result }).then(
    () => {
      // Dispatch event
    },
    (errorMessage) => {
      dispatch(exerciseFinishFailed(errorMessage));
    },
  );
  updateAchievements(dispatch, state);
};

export const finishHelpExercise = (attemptId, data) => (dispatch, getState) => {
  dispatch(timerStop());
  dispatch(exerciseFinishing());
  let state = getState();
  const { elapsedTime } = state.timing;
  const { type } = state.exercise;
  if (type === 'schulteTables') {
    const { tableDimensions } = state.options.exerciseOptions;
    dispatch(helpExerciseFinished(elapsedTime, { tableDimensions }));
  } else if (type === 'concentration') {
    dispatch(helpExerciseFinished(elapsedTime, data));
  } else {
    dispatch(helpExerciseFinished(elapsedTime));
  }
  state = getState();
  const { result } = state.exercise;
  api.finishExercise({ attemptId, result }).then(
    () => {
      // Dispatch event
    },
    (errorMessage) => {
      dispatch(exerciseFinishFailed(errorMessage));
    },
  );
  updateAchievements(dispatch, state);
};

export const retryExercise = () => (dispatch, getState) => {
  dispatch(timerReset());
  const { exerciseOptions } = getState().options;
  dispatch(exerciseRetry({ exerciseOptions }));
};

export const endExercise = () => (dispatch) => {
  dispatch(exerciseEnd());
};
