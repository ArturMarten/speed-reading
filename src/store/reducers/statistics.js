import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';
import { getExerciseById } from './exercise';

const initialState = {
  userExerciseStatistics: [],
  userExerciseStatisticsStatus: {
    loading: false,
    error: null,
  },
  groupExerciseStatistics: {},
  groupExerciseStatisticsStatus: {
    loading: false,
    error: null,
  },
};

const exerciseAttemptResultFilter = attempt => attempt.result !== null;

const exerciseAttemptMap = attempt => ({
  id: attempt.id,
  exerciseId: attempt.exerciseId,
  exercise: getExerciseById(attempt.exerciseId),
  modification: attempt.modification,
  date: new Date(attempt.startTime),
  readingTextTitle: attempt.readingTextTitle,
  userReadingAttemptCount: attempt.userReadingAttemptCount,
  wordsPerMinute: attempt.result.wpm,
  symbolsPerMinute: attempt.result.spm,
  exerciseResult: attempt.result.correct !== undefined && attempt.result.total !== undefined ?
    Math.round((attempt.result.correct / attempt.result.total) * 100) : null,
  elapsedTime: attempt.result.elapsedTime,
  testElapsedTime: attempt.test && attempt.test.result ? attempt.test.result.elapsedTime : 0,
  testResult: attempt.test && attempt.test.result ? Math.round(attempt.test.result.testResult * 100) : null,
  comprehensionResult: attempt.test && attempt.test.result ? Math.round(attempt.test.result.comprehensionResult * 100) : null,
  comprehensionPerMinute: attempt.test && attempt.test.result ? Math.round(attempt.test.result.cpm) : null,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_EXERCISE_STATISTICS_START: {
      return updateObject(state, {
        userExerciseStatisticsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USER_EXERCISE_STATISTICS_SUCCEEDED: {
      // Map statistics to specific exercise
      const userExerciseStatistics = action.payload
        .filter(exerciseAttemptResultFilter)
        .map(exerciseAttemptMap);
      return updateObject(state, {
        userExerciseStatistics,
        userExerciseStatisticsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USER_EXERCISE_STATISTICS_FAILED: {
      return updateObject(state, {
        userExerciseStatisticsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    case actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_START: {
      return updateObject(state, {
        groupExerciseStatisticsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_SUCCEEDED: {
      // Map statistics to specific exercise
      const groupExerciseStatistics = Object.assign(
        {},
        ...Object.keys(action.payload)
          .map(userId => ({
            [userId]: action.payload[userId]
              .filter(exerciseAttemptResultFilter)
              .map(exerciseAttemptMap),
          })),
      );
      return updateObject(state, {
        groupExerciseStatistics,
        groupExerciseStatisticsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_FAILED: {
      return updateObject(state, {
        groupExerciseStatisticsStatus: {
          loading: false,
          error: action.payload,
        },
      });
    }
    default:
      return state;
  }
};

export default reducer;
