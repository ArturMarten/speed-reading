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

export const MIN_TEXT_WIDTH = 250;
export const MAX_TEXT_WIDTH = 1200;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 18;

const initialTextOptions = {
  font: 'Calibri',
  width: Math.min(document.body.clientWidth, 1000),
  fontSize: 14,
};

const defaultVisibleTextOptions = ['font', 'width', 'fontSize'];

export const MIN_CHARACTER_COUNT = 5;
export const MAX_CHARACTER_COUNT = 30;
export const MIN_START_DELAY = 0;
export const MAX_START_DELAY = 500;
export const MIN_LINE_BREAK_DELAY = 0;
export const MAX_LINE_BREAK_DELAY = 300;

const initialExerciseOptions = {
  startDelay: 300,
  lineBreakDelay: 100,
  characterCount: 15,
};

const defaultVisibleExerciseOptions = ['startDelay', 'lineBreakDelay'];

export const MIN_WPM = 10;
export const MAX_WPM = 500;
export const MIN_FIXATION = 50;
export const MAX_FIXATION = 750;

const initialSpeedOptions = {
  wpm: 300,
  fixation: 300,
};

const defaultVisibleSpeedOptions = ['wpm'];

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
        case 'wordGroup':
          return updateObject(state, {
            visibleTextOptions: [...defaultVisibleTextOptions],
            visibleExerciseOptions: [...defaultVisibleExerciseOptions, 'characterCount'],
            visibleSpeedOptions: ['fixation'],
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
