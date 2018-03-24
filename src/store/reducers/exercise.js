import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject } from '../../shared/utility';

const READING_TEST_ID = 1;
const READING_AID_ID = 2;
const DISAPPEARING_ID = 3;
const WORD_GROUPS_ID = 4;
export const EXERCISE_COUNT = 4;

const initialState = {
  id: null,
  attemptId: null,
  type: '',
  started: false,
  finished: false,
  prepared: false,
  wordGroups: [],
  result: {
    elapsedTime: 0,
    wpm: 0,
    cps: 0,
  },
};

const getExerciseId = (exerciseType) => {
  switch (exerciseType) {
    case 'readingTest':
      return READING_TEST_ID;
    case 'readingAid':
      return READING_AID_ID;
    case 'disappearing':
      return DISAPPEARING_ID;
    case 'wordGroups':
      return WORD_GROUPS_ID;
    default:
      return null;
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXERCISE_SELECT: {
      console.log(`Exercise selected: ${action.payload}`);
      return updateObject(state, {
        id: getExerciseId(action.payload),
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
    case actionTypes.EXERCISE_ATTEMPT_START: {
      return updateObject(state, {
        attemptId: action.payload,
      });
    }
    case actionTypes.EXERCISE_FINISH: {
      const { elapsedTime, selectedText } = action.payload;
      const result = updateObject(state.result, {
        elapsedTime,
        wpm: Math.round(selectedText.wordCount / (elapsedTime / (1000 * 60))),
        cps: Math.round(selectedText.characterCount / (elapsedTime / (1000))),
      });
      return updateObject(state, {
        finished: true,
        result,
      });
    }
    default:
      return state;
  }
};

export default reducer;
