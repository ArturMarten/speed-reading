import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialTextOptions = {
  font: 'Calibri',
  width: Math.min(document.body.clientWidth, 700),
  lineCount: 5,
  fontSize: 16,
};

const initialExerciseOptions = {
  wpm: 300,
  fixation: 150,
  characterCount: 15,
};

const initialSpeedOptions = {
  wpm: 300,
  fixation: 150,
};

const initialState = {
  textOptions: initialTextOptions,
  exerciseOptions: initialExerciseOptions,
  speedOptions: initialSpeedOptions,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEXT_OPTIONS_UPDATED: {
      const updatedTextOptions = updateObject(state.textOptions, action.payload);
      return updateObject(state, {
        textOptions: updatedTextOptions,
      });
    }
    case actionTypes.EXERCISE_OPTIONS_UPDATED: {
      const updatedExerciseOptions = updateObject(state.exerciseOptions, action.payload);
      return updateObject(state, {
        exerciseOptions: updatedExerciseOptions,
      });
    }
    case actionTypes.SPEED_OPTIONS_UPDATED: {
      const updatedSpeedOptions = updateObject(state.speedOptions, action.payload);
      return updateObject(state, {
        speedOptions: updatedSpeedOptions,
      });
    }
    default:
      return state;
  }
};

export default reducer;
