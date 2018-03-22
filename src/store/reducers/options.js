import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialTextOptions = {
  font: 'Calibri',
  width: Math.min(document.body.clientWidth, 800),
  fontSize: 14,
};

const initialExerciseOptions = {
  characterCount: 15,
  startDelay: 300,
  lineBreakDelay: 100,
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
    default:
      return state;
  }
};

export default reducer;
