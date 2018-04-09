import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  exerciseStatistics: [],
  exerciseStatisticsStatus: {
    loading: false,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXERCISE_STATISTICS_START: {
      return updateObject(state, {
        exerciseStatisticsStatus: {
          loading: true,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_EXERCISE_STATISTICS_SUCCEEDED: {
      // Map statistics to specific exercise
      const exerciseStatistics = action.payload
        .filter(attempt => attempt.result !== null)
        .map(attempt => ({
          id: attempt.id,
          exerciseId: attempt.exerciseId,
          modification: attempt.modification,
          date: new Date(attempt.startTime),
          readingAttempt: attempt.readingAttempt,
          wpm: attempt.result.wpm,
          spm: attempt.result.spm,
          exerciseResult: attempt.result.correct !== undefined && attempt.result.total !== undefined ?
            Math.round((attempt.result.correct / attempt.result.total) * 100) : null,
          elapsedTime: attempt.result.elapsedTime,
          testResult: attempt.test && attempt.test.result ? Math.round((attempt.test.result.correct / attempt.test.result.total) * 100) : null,
        }));
      return updateObject(state, {
        exerciseStatistics,
        exerciseStatisticsStatus: {
          loading: false,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_EXERCISE_STATISTICS_FAILED: {
      return updateObject(state, {
        exerciseStatisticsStatus: {
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
