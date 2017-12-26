import {EditorState, ContentState} from 'draft-js';

import {splitIntoWordGroups} from '../utils/TextUtils';

import {
  START_REQUESTED,
  STOP_REQUESTED,
  RESET_REQUESTED,
  TICK,
  EDITOR_STATE_UPDATED,
  TEXT_OPTIONS_UPDATED,
  EXERCISE_OPTIONS_UPDATED,
  EXERCISE_SELECTED
} from '../actions';

// eslint-disable-next-line
const text = 'Lorem ipsum dolor sit amet, praesent torquent dictum vel augue proin at, sollicitudin orci rhoncus semper, arcu et ut accumsan metus amet, mauris tellus tortor, magna imperdiet erat. Vel leo est velit tellus tellus, aliquet in, vestibulum ut erat, mi arcu elit arcu et amet. Elit orci hymenaeos accumsan sed sem ac, nec augue arcu sed in id, ac proin. Lacus aliquam diam pulvinar, neque mauris elementum eu, mauris auctor vestibulum amet turpis. Nunc sem aenean nec elit, elementum nulla, mauris est cillum et.';

const initialState = {
  started: false,
  finished: false,
  resetted: false,
  type: '',
  editorState: EditorState.createWithContent(ContentState.createFromText(text)),
  text: text,
  wordGroups: splitIntoWordGroups(text, 15),
  words: text.split(' '),
  exerciseOptions: {
    wpm: 200,
    fixation: 200,
    characterCount: 15
  },
  textOptions: {
    width: 500,
    lineCount: 5,
    fontSize: 16
  }
};

const ExerciseReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_REQUESTED: {
      console.log('Started!');
      return {
        ...state,
        started: true,
        resetted: false
      };
    }
    case STOP_REQUESTED: {
      console.log('Stopped!');
      return {
        ...state,
        started: false
      };
    }
    case RESET_REQUESTED: {
      console.log('Resetted!');
      return {
        ...state,
        started: false,
        resetted: true,
        finished: false
      };
    }
    case EDITOR_STATE_UPDATED: {
      return {
        ...state,
        editorState: action.payload,
        text: action.payload.getCurrentContent().getPlainText()
      };
    }
    case TICK: {
      console.log('Tick!');
      return {
        ...state
      };
    }
    case TEXT_OPTIONS_UPDATED: {
      return {
        ...state,
        textOptions: Object.assign(state.textOptions, action.payload)
      };
    }
    case EXERCISE_OPTIONS_UPDATED: {
      const wordGroups =
        state.exerciseOptions.characterCount === action.payload.characterCount ?
        state.wordGroups : splitIntoWordGroups(text, action.payload.characterCount);
      return {
        ...state,
        exerciseOptions: Object.assign(state.exerciseOptions, action.payload),
        wordGroups: wordGroups
      };
    }
    case EXERCISE_SELECTED: {
      console.log('Exercise selected: ' + action.payload);
      return {
        ...state,
        type: action.payload
      };
    }
    default:
      return state;
  }
};

export default ExerciseReducer;
