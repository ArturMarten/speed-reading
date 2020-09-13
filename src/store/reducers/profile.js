import * as actionTypes from '../actions/actionTypes';

import { updateObject } from '../../shared/utility';
import { initialAchievements, mergeDeep, checkTemporalAchievements } from '../../containers/Achievements/achievements';

export const rolePermissions = {
  guest: 0,
  student: 1,
  statistician: 2,
  editor: 3,
  teacher: 4,
  developer: 5,
  admin: 6,
};

const initialState = {
  groupId: null,
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  achievements: initialAchievements,
  achievementsDiff: null,
  profileStatus: {
    loading: false,
    message: null,
    error: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_PROFILE_START: {
      return updateObject(state, {
        profileStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.FETCH_USER_PROFILE_SUCCEEDED: {
      const achievements =
        action.payload.achievements !== null
          ? mergeDeep(initialAchievements, action.payload.achievements)
          : initialAchievements;
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
          error: null,
        },
        ...action.payload,
        firstName: action.payload.firstName !== null ? action.payload.firstName : '',
        lastName: action.payload.lastName !== null ? action.payload.lastName : '',
        achievements: checkTemporalAchievements(achievements, new Date()),
      });
    }
    case actionTypes.FETCH_USER_PROFILE_FAILED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.SAVE_USER_PROFILE_START: {
      return updateObject(state, {
        profileStatus: {
          loading: true,
          message: null,
          error: null,
        },
      });
    }
    case actionTypes.SAVE_USER_PROFILE_SUCCEEDED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: action.payload.message,
          error: null,
        },
        ...action.payload.userProfile,
      });
    }
    case actionTypes.SAVE_USER_PROFILE_FAILED: {
      return updateObject(state, {
        profileStatus: {
          loading: false,
          message: null,
          error: action.payload,
        },
      });
    }
    case actionTypes.ACHIEVEMENTS_UPDATED: {
      return updateObject(state, {
        achievements: action.payload.achievements,
        achievementsDiff: action.payload.achievementsDiff,
      });
    }
    case actionTypes.AUTH_LOGOUT: {
      return updateObject(state, {
        ...initialState,
      });
    }
    default:
      return state;
  }
};

export default reducer;
