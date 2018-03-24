import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';

const initialState = {
  exerciseSettingsInfo: true,
  speedChangeInfo: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DISMISS_EXERCISE_SETTINGS_INFO: {
      return updateObject(state, {
        exerciseSettingsInfo: false,
      });
    }
    case actionTypes.DISMISS_SPEED_CHANGE_INFO: {
      return updateObject(state, {
        speedChangeInfo: false,
      });
    }
    default:
      return state;
  }
};

export default reducer;
