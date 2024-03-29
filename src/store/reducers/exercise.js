import * as actionTypes from '../actions/actionTypes';
import { splitIntoWordGroups } from '../../utils/TextUtils';
import { updateObject, shuffle, getSimilarSymbol, getSymbolCount, getRandomBoolean } from '../../shared/utility';
import tetragrams from '../../assets/doc/tetragrams.json';
import trigrams from '../../assets/doc/trigrams.json';
import bigrams from '../../assets/doc/bigrams.json';

const ngrams = [...tetragrams, ...trigrams, ...bigrams].sort((a, b) => b.length - a.length);
const ngramWords = ngrams.flatMap((ngram) => ngram.split(' '));

const READING_TEST_ID = 1;
const READING_AID_ID = 2;
const SCROLLING_ID = 3;
const DISAPPEARING_ID = 4;
const WORD_GROUPS_ID = 5;
const SCHULTE_TABLES_ID = 6;
const CONCENTRATION_ID = 7;
const VERTICAL_READING_ID = 8;
const MOVING_WORD_GROUPS_ID = 9;
const VISUAL_VOCABULARY_ID = 10;

export const EXERCISE_COUNT = 10;

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
        [...Array(count)].map((_, index) => (getRandomBoolean() ? letters[index].toUpperCase() : letters[index])),
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
  return Object.assign([...array], {
    [randomIndex]: getSimilarSymbol(array[randomIndex]),
  }).join('');
};

const swapRandomWord = (string) => {
  const array = string.split(' ');
  const randomIndex = Math.floor(Math.random() * array.length);
  const currentWord = array[randomIndex];
  const swapWords = ngramWords.filter((word) => word.length === currentWord.length && word !== currentWord);
  const swapWord = getArrayRandom(swapWords);
  return Object.assign([...array], {
    [randomIndex]: swapWord,
  }).join(' ');
};

const getArrayRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateStringPairs = (count, length, modification) => {
  let strings = [];
  switch (modification) {
    case 'concentration-visual-vocabulary':
      const NGRAM_COUNT = 100;
      const filtered = ngrams.filter((ngram) => ngram.replace(/\s/g, '').length <= length).slice(0, NGRAM_COUNT);
      strings = [...Array(count)].map(() => getArrayRandom(filtered));
      break;
    case 'concentration-numbers-only':
      strings = [...Array(count)].map(() => generateRandomString(numbers, length));
      break;
    case 'concentration-letters-only':
      strings = [...Array(count)].map(() => generateRandomString(letters, length));
      break;
    case 'concentration-mixed':
      strings = [...Array(count)].map(() => generateRandomString(getRandomBoolean() ? numbers : letters, length));
      break;
    default:
      strings = [...Array(count)].map(() => generateRandomString(numbers, length));
      break;
  }
  return strings.map((string) => shuffle([string, getRandomBoolean() ? string : swapRandomSymbol(string)]));
};

export const generateWordPairs = (count, length) => {
  const NGRAM_COUNT = 100;
  const filtered = ngrams.filter((ngram) => ngram.replace(/\s/g, '').length <= length).slice(0, NGRAM_COUNT);
  const strings = [...Array(count)].map(() => getArrayRandom(filtered));
  return strings.map((string) => [string, getRandomBoolean() ? string : swapRandomWord(string)]);
};

export const getExerciseId = (exerciseType) => {
  switch (exerciseType) {
    case 'readingExercises':
      return [
        READING_TEST_ID,
        READING_AID_ID,
        SCROLLING_ID,
        DISAPPEARING_ID,
        WORD_GROUPS_ID,
        VERTICAL_READING_ID,
        MOVING_WORD_GROUPS_ID,
      ];
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
    case 'verticalReading':
      return [VERTICAL_READING_ID];
    case 'movingWordGroups':
      return [MOVING_WORD_GROUPS_ID];
    case 'schulteTables':
      return [SCHULTE_TABLES_ID];
    case 'concentration':
      return [CONCENTRATION_ID];
    case 'visualVocabulary':
      return [VISUAL_VOCABULARY_ID];
    default:
      return null;
  }
};

export const getExerciseStatisticsIds = (exerciseType) => {
  if (
    [
      'readingExercises',
      'readingTest',
      'readingAid',
      'scrolling',
      'disappearing',
      'wordGroups',
      'verticalReading',
      'movingWordGroups',
    ].includes(exerciseType)
  ) {
    return [READING_TEST_ID, READING_AID_ID, SCROLLING_ID, DISAPPEARING_ID, WORD_GROUPS_ID, VERTICAL_READING_ID];
  }
  if (exerciseType === 'schulteTables') {
    return [SCHULTE_TABLES_ID];
  }
  if (exerciseType === 'concentration') {
    return [CONCENTRATION_ID];
  }
  if (exerciseType === 'visualVocabulary') {
    return [VISUAL_VOCABULARY_ID];
  }
  return null;
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
    case VERTICAL_READING_ID:
      return 'verticalReading';
    case MOVING_WORD_GROUPS_ID:
      return 'movingWordGroups';
    case SCHULTE_TABLES_ID:
      return 'schulteTables';
    case CONCENTRATION_ID:
      return 'concentration';
    case VISUAL_VOCABULARY_ID:
      return 'visualVocabulary';
    default:
      return null;
  }
};

const initialState = {
  id: null,
  save: true,
  attempt: null,
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
          modificationOptions = [{ value: 'group-highlighted' }, { value: 'group-blurry' }, { value: 'group-single' }];
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
          modification = 'concentration-visual-vocabulary';
          modificationOptions = [
            { value: 'concentration-visual-vocabulary' },
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
      if (state.type === 'wordGroups' || state.type === 'verticalReading' || state.type === 'movingWordGroups') {
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
      } else if (state.type === 'visualVocabulary') {
        const stringPairs = generateWordPairs(
          action.payload.exerciseOptions.symbolGroupCount,
          action.payload.exerciseOptions.symbolCount,
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
        attempt: action.payload,
        attemptId: action.payload.id,
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
        attempt: { ...state.attempt, result },
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
        const { answers, exerciseOptions } = action.payload;
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
        const msPerSymbolGroup = Math.round(elapsedTime / exerciseOptions.symbolGroupCount);
        const msPerSymbol = Math.round(
          elapsedTime / (2 * exerciseOptions.symbolCount * exerciseOptions.symbolGroupCount),
        );

        result = {
          elapsedTime,
          total,
          correct,
          incorrect,
          unanswered,
          msPerSymbolGroup,
          msPerSymbol,
        };
      } else if (state.type === 'visualVocabulary') {
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
        attempt: { ...state.attempt, result },
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
      if (state.type === 'visualVocabulary') {
        return updateObject(state, {
          stringPairs: generateWordPairs(
            action.payload.exerciseOptions.symbolGroupCount,
            action.payload.exerciseOptions.symbolCount,
          ),
          status: 'prepared',
        });
      }
      return state;
    }
    case actionTypes.EXERCISE_END: {
      // Cleanup after exercise end
      return updateObject(state, {
        attempt: null,
        attemptId: null,
        status: 'preparation',
        wordGroups: [],
        symbols: [],
        stringPairs: [],
        result: {},
      });
    }
    default:
      return state;
  }
};

export default reducer;
