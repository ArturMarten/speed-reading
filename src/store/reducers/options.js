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

export const tableDimensionOptions = [
  { text: '5 x 5', value: 25 },
];

export const MIN_TEXT_WIDTH = 250;
export const MAX_TEXT_WIDTH = 1600;
export const STEP_TEXT_WIDTH = 50;
export const MIN_FONT_SIZE = 10;
export const MAX_FONT_SIZE = 30;
export const STEP_FONT_SIZE = 1;
export const MIN_LINE_SPACING = 1.0;
export const MAX_LINE_SPACING = 1.5;
export const STEP_LINE_SPACING = 0.1;
export const MIN_SYMBOL_SIZE = 40;
export const MAX_SYMBOL_SIZE = 100;
export const STEP_SYMBOL_SIZE = 5;

const initialTextOptions = {
  font: 'Calibri',
  width: Math.min(document.body.clientWidth, 1000),
  fontSize: 14,
  lineSpacing: 1.0,
  symbolSize: 80,
};

const defaultVisibleTextOptions = ['font', 'width', 'fontSize'];

export const MIN_CHARACTER_COUNT = 5;
export const MAX_CHARACTER_COUNT = 30;
export const STEP_CHARACTER_COUNT = 1;
export const MIN_START_DELAY = 0;
export const MAX_START_DELAY = 500;
export const STEP_START_DELAY = 50;
export const MIN_LINE_BREAK_DELAY = 0;
export const MAX_LINE_BREAK_DELAY = 500;
export const STEP_LINE_BREAK_DELAY = 10;
export const MIN_PAGE_BREAK_DELAY = 0;
export const MAX_PAGE_BREAK_DELAY = 500;
export const STEP_PAGE_BREAK_DELAY = 10;
export const MIN_TABLE_SIZE = 30;
export const MAX_TABLE_SIZE = 100;
export const STEP_TABLE_SIZE = 10;
export const MIN_SYMBOL_GROUP_COUNT = 20;
export const MAX_SYMBOL_GROUP_COUNT = 40;
export const STEP_SYMBOL_GROUP_COUNT = 1;
export const MIN_SYMBOL_COUNT = 5;
export const MAX_SYMBOL_COUNT = 15;
export const STEP_SYMBOL_COUNT = 1;
export const MIN_COLUMN_SPACING = 10;
export const MAX_COLUMN_SPACING = 200;
export const STEP_COLUMN_SPACING = 10;

const initialExerciseOptions = {
  startDelay: 300,
  lineBreakDelay: 100,
  pageBreakDelay: 200,
  characterCount: 15,
  tableDimensions: 25,
  tableSize: 100,
  tableCheck: false,
  symbolCount: 7,
  symbolGroupCount: 20,
  columnSpacing: 30,
};

const defaultVisibleExerciseOptions = ['startDelay', 'lineBreakDelay'];

export const MIN_WPM = 10;
export const MAX_WPM = 500;
export const STEP_WPM = 10;
export const MIN_FIXATION = 50;
export const MAX_FIXATION = 750;
export const STEP_FIXATION = 10;

const initialSpeedOptions = {
  wpm: 250,
  fixation: 400,
};

const defaultVisibleSpeedOptions = ['wpm'];

const includesKey = array => key => array.includes(key);

const reduceObject = obj => (acc, key) => {
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
        case 'disappearing':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions],
            visibleSpeedOptions: [...defaultVisibleSpeedOptions],
          });
        case 'wordGroups':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions, 'characterCount'],
            visibleSpeedOptions: ['fixation'],
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
