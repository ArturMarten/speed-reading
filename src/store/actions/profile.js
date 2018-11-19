import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import * as api from '../../api';

const fetchUserProfileStart = () => ({
  type: actionTypes.FETCH_USER_PROFILE_START,
});

const fetchUserProfileSucceeded = user => ({
  type: actionTypes.FETCH_USER_PROFILE_SUCCEEDED,
  payload: user,
});

const fetchUserProfileFailed = error => ({
  type: actionTypes.FETCH_USER_PROFILE_FAILED,
  payload: error,
});

export const fetchUserProfile = userId => (dispatch) => {
  dispatch(fetchUserProfileStart());
  api.fetchUserProfile(userId)
    .then((userProfile) => {
      dispatch(fetchUserProfileSucceeded(userProfile));
    }, (errorMessage) => {
      dispatch(fetchUserProfileFailed(errorMessage));
      dispatch(actionCreators.logout(errorMessage));
    });
};

const saveUserProfileStart = () => ({
  type: actionTypes.SAVE_USER_PROFILE_START,
});

const saveUserProfileSucceeded = (message, userProfile) => ({
  type: actionTypes.SAVE_USER_PROFILE_SUCCEEDED,
  payload: {
    message,
    userProfile,
  },
});

const saveUserProfileFailed = error => ({
  type: actionTypes.SAVE_USER_PROFILE_FAILED,
  payload: error,
});

export const saveUserProfile = (userId, userProfileData) => (dispatch) => {
  dispatch(saveUserProfileStart());
  api.saveUserProfile({ userId, userProfileData })
    .then((message) => {
      dispatch(saveUserProfileSucceeded(message, userProfileData));
    }, (errorMessage) => {
      dispatch(saveUserProfileFailed(errorMessage));
    });
};

export default fetchUserProfile;
