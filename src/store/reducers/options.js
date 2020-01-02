import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

export const fontOptions = [
  { text: 'Arial', value: 'Arial' },
  { text: 'Calibri', value: 'Calibri' },
  { text: 'Comic Sans MS', value: 'Comic Sans MS' },
  { text: 'Courier New', value: 'Courier New' },
  { text: 'Garamond', value: 'Garamond' },
  { text: 'Georgia', value: 'Georgia' },
  { text: 'Impact', value: 'Impact' },
  { text: 'Times New Roman', value: 'Times New Roman' },
  { text: 'Trebuchet MS', value: 'Trebuchet MS' },
  { text: 'Verdana', value: 'Verdana' },
  { text: 'Serif', value: 'serif' },
  { text: 'Sans-serif', value: 'sans-serif' },
];

export const cursorTypeOptions = [{ value: 'background' }, { value: 'underline' }];

export const cursorColorOptions = [
  { value: 'bright-green' },
  { value: 'bright-orange' },
  { value: 'bright-blue' },
  { value: 'dark-gray' },
  { value: 'light-gray' },
];

export const getColorRGBA = (color) => {
  switch (color) {
    case 'bright-green':
      return 'rgba(57, 255, 20, 0.9)';
    case 'bright-orange':
      return 'rgba(255, 102, 0, 0.9)';
    case 'bright-blue':
      return 'rgba(125, 249, 255, 0.9)';
    case 'dark-gray':
      return 'rgba(160, 160, 160, 0.9)';
    case 'light-gray':
      return 'rgba(220, 220, 220, 0.9)';
    default:
      return 'rgba(57, 255, 20, 0.9)';
  }
};

export const tableDimensionOptions = [
  { text: '3 x 3', value: '3x3' },
  { text: '3 x 4', value: '3x4' },
  { text: '3 x 5', value: '3x5' },
  { text: '4 x 4', value: '4x4' },
  { text: '4 x 5', value: '4x5' },
  { text: '5 x 4', value: '5x4' },
  { text: '5 x 5', value: '5x5' },
  { text: '5 x 6', value: '5x6' },
  { text: '6 x 5', value: '6x5' },
];

export const MIN_TEXT_WIDTH = 250;
export const MAX_TEXT_WIDTH = 1600;
export const STEP_TEXT_WIDTH = 50;
export const MIN_TEXT_HEIGHT = 100;
export const MAX_TEXT_HEIGHT = 1200;
export const STEP_TEXT_HEIGHT = 50;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 30;
export const STEP_FONT_SIZE = 1;
export const MIN_LINE_SPACING = 1.0;
export const MAX_LINE_SPACING = 1.5;
export const STEP_LINE_SPACING = 0.1;
export const MIN_LINE_COUNT = 2;
export const MAX_LINE_COUNT = 10;
export const STEP_LINE_COUNT = 1;
export const MIN_SYMBOL_SIZE = 40;
export const MAX_SYMBOL_SIZE = 100;
export const STEP_SYMBOL_SIZE = 5;

const initialTextOptions = {
  font: 'Calibri',
  width: Math.min(document.body.clientWidth - 6, 1000),
  height: 400,
  fontSize: 14,
  lineSpacing: 1.0,
  lineCount: 5,
  symbolSize: 80,
};

const defaultVisibleTextOptions = ['font', 'width', 'fontSize'];

export const MIN_START_DELAY = 0;
export const MAX_START_DELAY = 1000;
export const STEP_START_DELAY = 50;
export const MIN_LINE_BREAK_DELAY = 0;
export const MAX_LINE_BREAK_DELAY = 500;
export const STEP_LINE_BREAK_DELAY = 10;
export const MIN_PAGE_BREAK_DELAY = 0;
export const MAX_PAGE_BREAK_DELAY = 1000;
export const STEP_PAGE_BREAK_DELAY = 10;
export const MIN_GROUP_CHARACTER_COUNT = 5;
export const MAX_GROUP_CHARACTER_COUNT = 30;
export const STEP_GROUP_CHARACTER_COUNT = 1;
export const MIN_GROUP_SPACING = 5;
export const MAX_GROUP_SPACING = 100;
export const STEP_GROUP_SPACING = 5;
export const MIN_TABLE_SIZE = 30;
export const MAX_TABLE_SIZE = 100;
export const STEP_TABLE_SIZE = 10;
export const MIN_SYMBOL_GROUP_COUNT = 20;
export const MAX_SYMBOL_GROUP_COUNT = 40;
export const STEP_SYMBOL_GROUP_COUNT = 1;
export const MIN_SYMBOL_COUNT = 2;
export const MAX_SYMBOL_COUNT = 15;
export const STEP_SYMBOL_COUNT = 1;
export const MIN_COLUMN_SPACING = 10;
export const MAX_COLUMN_SPACING = 200;
export const STEP_COLUMN_SPACING = 10;

const initialExerciseOptions = {
  startDelay: 300,
  lineBreakDelay: 100,
  pageBreakDelay: 400,
  cursorType: 'background',
  cursorColor: 'bright-green',
  groupCharacterCount: 15,
  groupSpacing: 30,
  tableDimensions: '5x5',
  tableSize: 100,
  tableCheck: false,
  symbolCount: 7,
  symbolGroupCount: 20,
  columnSpacing: 30,
};

const defaultVisibleExerciseOptions = ['startDelay', 'lineBreakDelay', 'pageBreakDelay'];

export const MIN_WORDS_PER_MINUTE = 10;
export const MAX_WORDS_PER_MINUTE = 700;
export const STEP_WORDS_PER_MINUTE = 10;

const initialSpeedOptions = {
  wordsPerMinute: 200,
};

const defaultVisibleSpeedOptions = ['wordsPerMinute'];

const includesKey = (array) => (key) => array.includes(key);

const reduceObject = (obj) => (acc, key) => {
  acc[key] = obj[key];
  return acc;
};

export const getCurrentOptions = (state) => {
  const textOptions = Object.keys(state.textOptions)
    .filter(includesKey(state.visibleTextOptions))
    .reduce(reduceObject(state.textOptions), {});
  const exerciseOptions = Object.keys(state.exerciseOptions)
    .filter(includesKey(state.visibleExerciseOptions))
    .reduce(reduceObject(state.exerciseOptions), {});
  const speedOptions = Object.keys(state.speedOptions)
    .filter(includesKey(state.visibleSpeedOptions))
    .reduce(reduceObject(state.speedOptions), {});
  return { textOptions, exerciseOptions, speedOptions };
};

const initialState = {
  textOptions: initialTextOptions,
  exerciseOptions: initialExerciseOptions,
  speedOptions: initialSpeedOptions,
  visibleTextOptions: [...defaultVisibleTextOptions],
  visibleExerciseOptions: [...defaultVisibleExerciseOptions],
  visibleSpeedOptions: [...defaultVisibleSpeedOptions],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PROFILE_SUCCEEDED: {
      const { settings } = action.payload;
      if (settings != null) {
        return updateObject(state, {
          textOptions: updateObject(state.textOptions, settings.textOptions),
          exerciseOptions: updateObject(state.exerciseOptions, settings.exerciseOptions),
          speedOptions: updateObject(state.speedOptions, settings.speedOptions),
        });
      }
      return state;
    }
    case actionTypes.TEXT_OPTION_UPDATED: {
      const updatedTextOptions = updateObject(state.textOptions, action.payload);
      return updateObject(state, {
        textOptions: updatedTextOptions,
      });
    }
    case actionTypes.EXERCISE_OPTION_UPDATED: {
      const updatedExerciseOptions = updateObject(state.exerciseOptions, action.payload);
      return updateObject(state, {
        exerciseOptions: updatedExerciseOptions,
      });
    }
    case actionTypes.SPEED_OPTION_UPDATED: {
      const updatedSpeedOptions = updateObject(state.speedOptions, action.payload);
      return updateObject(state, {
        speedOptions: updatedSpeedOptions,
      });
    }
    case actionTypes.RESET_TEXT_OPTIONS: {
      const resettedTextOptions = updateObject(state.textOptions, {});
      state.visibleTextOptions.forEach((textOption) => {
        resettedTextOptions[textOption] = initialTextOptions[textOption];
      });
      return updateObject(state, {
        textOptions: resettedTextOptions,
      });
    }
    case actionTypes.RESET_EXERCISE_OPTIONS: {
      const resettedExerciseOptions = updateObject(state.exerciseOptions, {});
      state.visibleExerciseOptions.forEach((exerciseOption) => {
        resettedExerciseOptions[exerciseOption] = initialExerciseOptions[exerciseOption];
      });
      return updateObject(state, {
        exerciseOptions: resettedExerciseOptions,
      });
    }
    case actionTypes.EXERCISE_SELECT: {
      const exerciseType = action.payload;
      switch (exerciseType) {
        case 'readingTest':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [],
            visibleSpeedOptions: [],
          });
        case 'readingAid':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions, 'cursorType', 'cursorColor'],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
        case 'scrolling':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions, 'lineCount'],
            visibleExerciseOptions: ['startDelay'],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
        case 'disappearing':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
        case 'wordGroups':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions, 'groupCharacterCount'],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
        case 'schulteTables':
          return updateObject(state, {
            visibleTextOptions: ['font', 'symbolSize'],
            visibleExerciseOptions: ['tableDimensions', 'tableSize', 'tableCheck'],
            visibleSpeedOptions: [],
          });
        case 'concentration':
          return updateObject(state, {
            visibleTextOptions: ['font', 'fontSize'],
            visibleExerciseOptions: ['symbolGroupCount', 'symbolCount', 'columnSpacing'],
            visibleSpeedOptions: [],
          });
        default:
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
      }
    }
    default:
      return state;
  }
};

export default reducer;
