import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject } from '../../shared/utility';

const READING_TEST_ID = 1;
const READING_AID_ID = 2;
const DISAPPEARING_ID = 3;
const WORD_GROUPS_ID = 4;
export const EXERCISE_COUNT = 4;

const initialResult = {
  elapsedTime: 0,
  wpm: 0,
  cps: 0,
};

const initialState = {
  id: null,
  attemptId: null,
  type: '',
  modification: 'default',
  status: 'preparation',
  wordGroups: [],
  result: initialResult,
};

export const getExerciseId = (exerciseType) => {
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
        status: 'preparation',
      });
    }
    case actionTypes.EXERCISE_PREPARING: {
      return updateObject(state, {
        status: 'preparing',
      });
    }
    case actionTypes.EXERCISE_PREPARED: {
      if (state.type === 'wordGroups') {
        const wordGroups = splitIntoWordGroups(action.payload.selectedText.plain, action.payload.exerciseOptions.characterCount);
        return updateObject(state, {
          wordGroups,
          status: 'prepared',
        });
      }
      return updateObject(state, {
        status: 'prepared',
      });
    }
    case actionTypes.EXERCISE_STARTING: {
      return updateObject(state, {
        status: 'starting',
      });
    }
    case actionTypes.EXERCISE_STARTED: {
      return updateObject(state, {
        status: 'started',
      });
    }
    case actionTypes.EXERCISE_ATTEMPT_START: {
      return updateObject(state, {
        attemptId: action.payload,
      });
    }
    case actionTypes.EXERCISE_FINISHING: {
      return updateObject(state, {
        status: 'finishing',
      });
    }
    case actionTypes.EXERCISE_FINISHED: {
      const { elapsedTime, selectedText } = action.payload;
      const result = updateObject(state.result, {
        elapsedTime,
        wpm: Math.round(selectedText.wordCount / (elapsedTime / (1000 * 60))),
        cps: Math.round(selectedText.characterCount / (elapsedTime / (1000))),
      });
      return updateObject(state, {
        status: 'finished',
        result,
      });
    }
    case actionTypes.EXERCISE_END: {
      // Cleanup after exercise end
      return updateObject(state, {
        attemptId: null,
      });
    }
    default:
      return state;
  }
};

export default reducer;
