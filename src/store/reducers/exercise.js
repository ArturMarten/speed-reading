import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject } from '../../shared/utility';

const initialState = {
  type: '',
  started: false,
  finished: false,
  prepared: false,
  wordGroups: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TIMER_START: {
      return updateObject(state, {
        started: true,
      });
    }
    case actionTypes.TIMER_STOP: {
      return updateObject(state, {
        finished: true,
      });
    }
    case actionTypes.EXERCISE_FINISHED: {
      return updateObject(state, {
        finished: true,
      });
    }
    case actionTypes.PREPARE_EXERCISE: {
      const wordGroups = splitIntoWordGroups(action.payload.text, action.payload.characterCount);
      return {
        ...state,
        wordGroups,
        prepared: true,
      };
    }
    case actionTypes.EXERCISE_SELECTED: {
      console.log(`Exercise selected: ${action.payload}`);
      return {
        ...state,
        type: action.payload,
        started: false,
        finished: false,
        prepared: action.payload !== 'wordGroup',
      };
    }
    default:
      return state;
  }
};

export default reducer;
