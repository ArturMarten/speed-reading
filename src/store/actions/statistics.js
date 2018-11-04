import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

const fetchUserExerciseStatisticsStart = () => ({
  type: actionTypes.FETCH_USER_EXERCISE_STATISTICS_START,
});

const fetchUserExerciseStatisticsSucceeded = userExercisesStatistics => ({
  type: actionTypes.FETCH_USER_EXERCISE_STATISTICS_SUCCEEDED,
  payload: userExercisesStatistics,
});

const fetchUserExerciseStatisticsFailed = error => ({
  type: actionTypes.FETCH_USER_EXERCISE_STATISTICS_FAILED,
  payload: error,
});

export const fetchUserExerciseStatistics = (userId, token) => (dispatch) => {
  dispatch(fetchUserExerciseStatisticsStart());
  axios.get(`/exerciseAttempts?userId=${userId}&embed=test`, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchUserExerciseStatisticsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchUserExerciseStatisticsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchUserExerciseStatisticsFailed(error.message));
    });
};

const fetchGroupExerciseStatisticsStart = () => ({
  type: actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_START,
});

const fetchGroupExerciseStatisticsSucceeded = groupExercisesStatistics => ({
  type: actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_SUCCEEDED,
  payload: groupExercisesStatistics,
});

const fetchGroupExerciseStatisticsFailed = error => ({
  type: actionTypes.FETCH_GROUP_EXERCISE_STATISTICS_FAILED,
  payload: error,
});

export const fetchGroupExerciseStatistics = (groupId, token) => (dispatch) => {
  dispatch(fetchGroupExerciseStatisticsStart());
  axios.get(`/exerciseAttempts?${groupId != null ? `&groupId=${groupId}&` : ''}groupBy=userId&embed=test`, { headers: { 'x-access-token': token } })
    .then((response) => {
      dispatch(fetchGroupExerciseStatisticsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchGroupExerciseStatisticsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchGroupExerciseStatisticsFailed(error.message));
    });
};
