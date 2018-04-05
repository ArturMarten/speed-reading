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
      return updateObject(state, {
        exerciseStatistics: action.payload,
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
