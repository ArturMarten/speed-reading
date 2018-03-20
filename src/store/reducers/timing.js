import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialTimer = {
  started: false,
  paused: false,
  resetted: false,
  stopped: false,
};

const initialState = {
  startTime: 0,
  elapsedTime: 0,
  timer: initialTimer,
};

const calculateElapsedTime = state => state.elapsedTime + (Date.now() - state.startTime);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TIMER_INIT: {
      return updateObject(state, initialState);
    }
    case actionTypes.TIMER_START: {
      console.log('Started!');
      const updatedTimer = updateObject(state.timer, {
        started: true,
        paused: false,
        resetted: false,
        stopped: false,
      });
      return updateObject(state, {
        startTime: Date.now(),
        timer: updatedTimer,
      });
    }
    case actionTypes.TIMER_PAUSE: {
      const updatedElapsedTime = calculateElapsedTime(state);
      console.log(`Paused! Elapsed: ${updatedElapsedTime}ms`);
      const updatedTimer = updateObject(state.timer, {
        paused: true,
      });
      return updateObject(state, {
        elapsedTime: updatedElapsedTime,
        timer: updatedTimer,
      });
    }
    case actionTypes.TIMER_RESUME: {
      const updatedTimer = updateObject(state.timer, {
        paused: false,
      });
      return updateObject(state, {
        startTime: Date.now(),
        timer: updatedTimer,
      });
    }
    case actionTypes.TIMER_RESET: {
      console.log('Resetted!');
      const updatedTimer = updateObject(initialState.timer, {
        resetted: true,
        paused: true,
      });
      const resettedState = updateObject(initialState, {
        timer: updatedTimer,
      });
      return updateObject(state, resettedState);
    }
    case actionTypes.TIMER_STOP: {
      let updatedElapsedTime = state.elapsedTime;
      if (!state.timer.paused) {
        updatedElapsedTime = calculateElapsedTime(state);
      }
      console.log(`Stopped! Elapsed: ${updatedElapsedTime}ms`);
      const updatedTimer = updateObject(state.timer, {
        stopped: true,
      });
      return updateObject(state, {
        elapsedTime: updatedElapsedTime,
        timer: updatedTimer,
      });
    }
    default:
      return state;
  }
};

export default reducer;
