import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialTimer = {
  started: false,
  paused: false,
  resetted: false,
  stopped: false
}

const initialState = {
  startTime: 0,
  elapsedTime: 0,
  timer: initialTimer
};

const updateElapsedTime = (state) => {
  return state.elapsedTime + (Date.now() - state.startTime);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TIMER_START: {
      console.log('Started!');
      const updatedTimer = updateObject(state.timer, {
        started: true,
        resetted: false,
        paused: false,
        stopped: false
      });
      return updateObject(state, {
        startTime: Date.now(),
        timer: updatedTimer
      });
    }
    case actionTypes.TIMER_PAUSE: {
      const updatedElapsedTime = updateElapsedTime(state);
      console.log('Paused! Elapsed: ' + updatedElapsedTime + 'ms');
      const updatedTimer = updateObject(state.timer, {
        paused: true
      });
      return updateObject(state, {
        elapsedTime: updatedElapsedTime,
        timer: updatedTimer
      });
    }
    case actionTypes.TIMER_RESUME: {
      const updatedTimer = updateObject(state.timer, {
        paused: false
      });
      return updateObject(state, {
        startTime: Date.now(),
        timer: updatedTimer
      });
    }
    case actionTypes.TIMER_RESET: {
      console.log('Resetted!');
      const updatedTimer = updateObject(state.timer, {
        started: false,
        resetted: true,
        stopped: false
      });
      return updateObject(state, {
        startTime: 0,
        elapsedTime: 0,
        timer: updatedTimer
      });
    }
    case actionTypes.TIMER_STOP: {
      const updatedElapsedTime = updateElapsedTime(state);
      console.log('Stopped! Elapsed: ' + updatedElapsedTime + 'ms');
      const updatedTimer = updateObject(state.timer, {
        stopped: true
      });
      return updateObject(state, {
        elapsedTime: updatedElapsedTime,
        timer: updatedTimer
      });
    }
    case actionTypes.EXERCISE_SELECTED: {
      return updateObject(state, initialState);
    }
    case actionTypes.EXERCISE_FINISHED: {
      const updatedElapsedTime = updateElapsedTime(state);
      console.log('Exercise finished! Elapsed: ' + updatedElapsedTime + 'ms');
      const updatedTimer = updateObject(state.timer, {
        stopped: true
      });
      return updateObject(state, {
        elapsedTime: updatedElapsedTime,
        timer: updatedTimer
      });
    }
    default:
      return state;
  }
}

export default reducer;