import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import axios from '../../axios-http';
import { serverSuccessMessage, serverErrorMessage } from '../../shared/utility';

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

export const fetchUserProfile = (userId, token) => (dispatch) => {
  dispatch(fetchUserProfileStart());
  axios.get(`/users/${userId}`, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchUserProfileSucceeded(response.data));
    }, (error) => {
      const errorMessage = serverErrorMessage(error);
      dispatch(fetchUserProfileFailed(errorMessage));
      dispatch(actionCreators.logout(errorMessage));
    })
    .catch((error) => {
      dispatch(fetchUserProfileFailed(error.message));
      dispatch(actionCreators.logout(error.message));
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

export const saveUserProfile = (userId, userProfileData, token) => (dispatch) => {
  dispatch(saveUserProfileStart());
  axios.put(`/users/${userId}`, userProfileData, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(saveUserProfileSucceeded(serverSuccessMessage(response), userProfileData));
    }, (error) => {
      const errorMessage = serverErrorMessage(error);
      dispatch(saveUserProfileFailed(errorMessage));
    })
    .catch((error) => {
      dispatch(saveUserProfileFailed(error.message));
    });
};

export default fetchUserProfile;
