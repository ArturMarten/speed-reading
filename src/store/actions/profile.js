import * as actionTypes from './actionTypes';
import * as actionCreators from './index';
import axios from '../../axios-http';

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
      const errorMessage = error.response && error.response.data && error.response.data.error ?
        error.response.data.error : error.message;
      dispatch(fetchUserProfileFailed(errorMessage));
      dispatch(actionCreators.authLogout(errorMessage));
    })
    .catch((error) => {
      dispatch(fetchUserProfileFailed(error.message));
      dispatch(actionCreators.authLogout(error.message));
    });
};

export default fetchUserProfile;
