import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject } from '../../shared/utility';

const initialState = {
  type: '',
  started: false,
  finished: false,
  prepared: false,
  wordGroups: [],
  results: {
    elapsedTime: 0,
    wpm: 0,
    cps: 0,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXERCISE_SELECT: {
      console.log(`Exercise selected: ${action.payload}`);
      return updateObject(state, {
        type: action.payload,
        started: false,
        finished: false,
        prepared: false,
      });
    }
    case actionTypes.EXERCISE_PREPARE: {
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
    case actionTypes.EXERCISE_START: {
      return updateObject(state, {
        started: true,
      });
    }
    case actionTypes.EXERCISE_FINISH: {
      const { elapsedTime, selectedText } = action.payload;
      const results = updateObject(state.results, {
        elapsedTime,
        wpm: Math.round(selectedText.wordCount / (elapsedTime / (1000 * 60))),
        cps: Math.round(selectedText.characterCount / (elapsedTime / (1000))),
      });
      return updateObject(state, {
        finished: true,
        results,
      });
    }
    default:
      return state;
  }
};

export default reducer;
