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
      if (state.type === 'wordGroup') {
        const wordGroups = splitIntoWordGroups(action.payload.selectedText.plain, action.payload.exerciseOptions.characterCount);
        return updateObject(state, {
          wordGroups,
          prepared: true,
        });
      }
      return updateObject(state, {
        prepared: true,
      });
    }
    case actionTypes.EXERCISE_SELECTED: {
      console.log(`Exercise selected: ${action.payload}`);
      return updateObject(state, {
        type: action.payload,
        started: false,
        finished: false,
        prepared: false,
      });
    }
    default:
      return state;
  }
};

export default reducer;
