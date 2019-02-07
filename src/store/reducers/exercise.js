import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject, shuffle, getSimilarSymbol, getSymbolCount } from '../../shared/utility';

const READING_TEST_ID = 1;
const READING_AID_ID = 2;
const SCROLLING_ID = 3;
const DISAPPEARING_ID = 4;
const WORD_GROUPS_ID = 5;
const SCHULTE_TABLES_ID = 6;
const CONCENTRATION_ID = 7;
export const EXERCISE_COUNT = 7;

const letters = 'abcdefghijklmnopqrsztuvwõäöüxy'.split('');
const numbers = '0123456789'.split('');

export const generateSymbols = (count, modification) => {
  switch (modification) {
    case 'numbers':
      return shuffle([...Array(count)].map((e, index) => index + 1));
    case 'letters-lowercase':
      return shuffle([...Array(count)].map((e, index) => letters[index]));
    case 'letters-uppercase':
      return shuffle([...Array(count)].map((e, index) => letters[index].toUpperCase()));
    case 'letters-mixed':
      return shuffle(
        [...Array(count)].map((e, index) =>
          Math.floor(Math.random() * 2) === 0 ? letters[index].toUpperCase() : letters[index],
        ),
      );
    default:
      return shuffle([...Array(count)].map((e, index) => index + 1));
  }
};

const generateRandomString = (array, length) =>
  [...Array(length)].map(() => array[Math.floor(Math.random() * array.length)]).join('');

const swapRandomSymbol = (string) => {
  const array = string.split('');
  const randomIndex = Math.floor(Math.random() * array.length);
  return Object.assign([...array], { [randomIndex]: getSimilarSymbol(array[randomIndex]) }).join('');
};

export const generateStringPairs = (count, length, modification) => {
  let first = [];
  switch (modification) {
    case 'concentration-numbers-only':
      first = [...Array(count)].map(() => generateRandomString(numbers, length));
      break;
    case 'concentration-letters-only':
      first = [...Array(count)].map(() => generateRandomString(letters, length));
      break;
    case 'concentration-mixed':
      first = [...Array(count)].map(() =>
        generateRandomString(Math.floor(Math.random() * 2) === 0 ? numbers : letters, length),
      );
      break;
    default:
      first = [...Array(count)].map(() => generateRandomString(numbers, length));
      break;
  }
  return first.map((string) => [string, Math.floor(Math.random() * 2) === 0 ? string : swapRandomSymbol(string)]);
};

export const getExerciseId = (exerciseType) => {
  switch (exerciseType) {
    case 'readingExercises':
      return [READING_TEST_ID, READING_AID_ID, SCROLLING_ID, DISAPPEARING_ID, WORD_GROUPS_ID];
    case 'readingTest':
      return [READING_TEST_ID];
    case 'readingAid':
      return [READING_AID_ID];
    case 'scrolling':
      return [SCROLLING_ID];
    case 'disappearing':
      return [DISAPPEARING_ID];
    case 'wordGroups':
      return [WORD_GROUPS_ID];
    case 'schulteTables':
      return [SCHULTE_TABLES_ID];
    case 'concentration':
      return [CONCENTRATION_ID];
    default:
      return null;
  }
};

export const getExerciseById = (exerciseId) => {
  switch (exerciseId) {
    case READING_TEST_ID:
      return 'readingTest';
    case READING_AID_ID:
      return 'readingAid';
    case SCROLLING_ID:
      return 'scrolling';
    case DISAPPEARING_ID:
      return 'disappearing';
    case WORD_GROUPS_ID:
      return 'wordGroups';
    case SCHULTE_TABLES_ID:
      return 'schulteTables';
    case CONCENTRATION_ID:
      return 'concentration';
    default:
      return null;
  }
};

const initialState = {
  id: null,
  save: true,
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EXERCISE_SELECT: {
      const exerciseType = action.payload;
      let modificationOptions = [];
      let modification = '';
      switch (exerciseType) {
        case 'wordGroups': {
          modification = 'group-highlighted';
          modificationOptions = [
            { value: 'group-highlighted' },
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
            { value: 'concentration-letters-only' },
            { value: 'concentration-mixed' },
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
        id: getExerciseId(action.payload)[0],
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
      let preparation = {};
      if (state.type === 'wordGroups') {
        const wordGroups = splitIntoWordGroups(
          action.payload.selectedText.plainText,
          action.payload.exerciseOptions.groupCharacterCount,
        );
        preparation = { wordGroups };
      } else if (state.type === 'schulteTables') {
        const symbolCount = getSymbolCount(action.payload.exerciseOptions.tableDimensions);
        const symbols = generateSymbols(symbolCount, state.modification);
        preparation = { symbols };
      } else if (state.type === 'concentration') {
        const stringPairs = generateStringPairs(
          action.payload.exerciseOptions.symbolGroupCount,
          action.payload.exerciseOptions.symbolCount,
          state.modification,
        );
        preparation = { stringPairs };
      }
      return updateObject(state, {
        save: action.payload.save,
        status: 'prepared',
        ...preparation,
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
        wordsPerMinute: Math.round(selectedText.wordCount / (elapsedTime / (1000 * 60))),
        charactersPerSecond: Math.round(selectedText.characterCount / (elapsedTime / 1000)),
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
        const { tableDimensions } = action.payload;
        const symbolCount = getSymbolCount(tableDimensions);
        result = {
          elapsedTime,
          symbolsPerMinute: Number.parseFloat((symbolCount / (elapsedTime / (1000 * 60))).toFixed(2)),
        };
      } else if (state.type === 'concentration') {
        const { answers } = action.payload;
        let total = 0;
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        state.stringPairs.forEach((pair, index) => {
          if (answers[index] !== undefined) {
            const match = pair[0] === pair[1];
            if (answers[index] === match) {
              correct += 1;
            } else {
              incorrect += 1;
            }
          } else {
            unanswered += 1;
          }
          total += 1;
        });
        result = {
          elapsedTime,
          total,
          correct,
          incorrect,
          unanswered,
        };
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
        const symbolCount = getSymbolCount(action.payload.exerciseOptions.tableDimensions);
        return updateObject(state, {
          symbols: generateSymbols(symbolCount, state.modification),
          status: 'prepared',
        });
      }
      if (state.type === 'concentration') {
        return updateObject(state, {
          stringPairs: generateStringPairs(
            action.payload.exerciseOptions.symbolGroupCount,
            action.payload.exerciseOptions.symbolCount,
            state.modification,
          ),
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
