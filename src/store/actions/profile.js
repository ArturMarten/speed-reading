import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

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

export default fetchUserProfile;
