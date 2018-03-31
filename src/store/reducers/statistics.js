import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  loading: false,
  exercise: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXERCISE_STATISTICS_START: {
      return updateObject(state, {
        loading: true,
      });
    }
    case actionTypes.FETCH_EXERCISE_STATISTICS_SUCCEEDED: {
      return updateObject(state, {
        loading: false,
        exercise: action.payload,
      });
    }
    case actionTypes.FETCH_EXERCISE_STATISTICS_FAILED: {
      return updateObject(state, {
        loading: false,
      });
    }
    default:
      return state;
  }
};

export default reducer;
