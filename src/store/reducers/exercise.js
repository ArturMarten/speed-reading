import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject, shuffle } from '../../shared/utility';

const READING_TEST_ID = 1;
const READING_AID_ID = 2;
const DISAPPEARING_ID = 3;
const WORD_GROUPS_ID = 4;
const SCHULTE_TABLES_ID = 5;
const CONCENTRATION_ID = 6;
export const EXERCISE_COUNT = 6;

export const generateSymbols = (count, modification) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  switch (modification) {
    case 'numbers':
      return shuffle([...Array(count)].map((e, index) => index + 1));
    case 'letters-lowercase':
      return shuffle([...Array(count)].map((e, index) => letters[index]));
    case 'letters-uppercase':
      return shuffle([...Array(count)].map((e, index) => letters[index].toUpperCase()));
    case 'letters-mixed':
      return shuffle([...Array(count)].map((e, index) => (Math.floor(Math.random() * 2) === 0 ? letters[index].toUpperCase() : letters[index])));
    default:
      return shuffle([...Array(count)].map((e, index) => index + 1));
  }
};

export const generateStringPairs = (count, modification) => {
  switch (modification) {
    case 'concentration-numbers-only':
      return [[1231263, 1231232], [143123, 123152], [1231263, 1231232], [143123, 123152], [1231263, 1231232], [143123, 123152]];
    default:
      return [[1231263, 1231232], [143123, 123152], [1231263, 1231232], [143123, 123152], [1231263, 1231232], [143123, 123152]];
  }
};

const initialState = {
  id: null,
  attemptId: null,
  type: '',
  modification: '',
  modificationOptions: [],
  status: 'preparation',
  wordGroups: [],
  symbols: [],
  stringPairs: [],
  result: {},
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
    case 'schulteTables':
      return SCHULTE_TABLES_ID;
    case 'concentration':
      return CONCENTRATION_ID;
    default:
      return null;
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXERCISE_SELECT: {
      let modificationOptions = [];
      let modification = '';
      switch (action.payload) {
        case 'wordGroups': {
          modification = 'group-single';
          modificationOptions = [
            { value: 'group-highlighted', disabled: true },
            { value: 'group-single' },
            { value: 'group-spacing', disabled: true },
            { value: 'group-vertical', disabled: true },
            { value: 'group-rsvp', disabled: true },
          ];
          break;
        }
        case 'schulteTables': {
          modification = 'numbers';
          modificationOptions = [
            { value: 'numbers' },
            { value: 'letters-lowercase' },
            { value: 'letters-uppercase' },
            { value: 'letters-mixed' },
          ];
          break;
        }
        case 'concentration': {
          modification = 'concentration-numbers-only';
          modificationOptions = [
            { value: 'concentration-numbers-only' },
            { value: 'concentration-letters-only', disabled: true },
            { value: 'concentration-mixed', disabled: true },
            { value: 'concentration-words', disabled: true },
          ];
          break;
        }
        default: {
          modification = 'default';
          modificationOptions = [{ value: 'default' }];
          break;
        }
      }

      return updateObject(state, {
        id: getExerciseId(action.payload),
        type: action.payload,
        status: 'preparation',
        modification,
        modificationOptions,
      });
    }
    case actionTypes.MODIFICATION_CHANGED: {
      return updateObject(state, {
        modification: action.payload,
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
      } else if (state.type === 'schulteTables') {
        const symbols = generateSymbols(25, state.modification);
        return updateObject(state, {
          symbols,
          status: 'prepared',
        });
      } else if (state.type === 'concentration') {
        const stringPairs = generateStringPairs(10, state.modification);
        return updateObject(state, {
          stringPairs,
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
    case actionTypes.EXERCISE_START_FAILED: {
      return updateObject(state, {
        status: 'prepared',
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
    case actionTypes.READING_EXERCISE_FINISHED: {
      const { elapsedTime, selectedText } = action.payload;
      const result = {
        elapsedTime,
        wpm: Math.round(selectedText.wordCount / (elapsedTime / (1000 * 60))),
        cps: Math.round(selectedText.characterCount / (elapsedTime / 1000)),
      };
      return updateObject(state, {
        status: 'finished',
        result,
      });
    }
    case actionTypes.HELP_EXERCISE_FINISHED: {
      const { elapsedTime } = action.payload;
      let result = {};
      if (state.type === 'schulteTables') {
        result = { elapsedTime, spm: +(action.payload.tableSize / (elapsedTime / (1000 * 60))).toFixed(2) };
      } else {
        result = { elapsedTime };
      }
      return updateObject(state, {
        status: 'finished',
        result,
      });
    }
    case actionTypes.EXERCISE_FINISH_FAILED: {
      return updateObject(state, {
        status: 'started',
      });
    }
    case actionTypes.EXERCISE_RETRY: {
      if (state.type === 'schulteTables') {
        return updateObject(state, {
          symbols: generateSymbols(25, state.modification),
          status: 'prepared',
        });
      } else if (state.type === 'concentration') {
        return updateObject(state, {
          stringPairs: generateStringPairs(10, state.modification),
          status: 'prepared',
        });
      }
      return state;
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
