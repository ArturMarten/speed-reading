import * as actionTypes from './actionTypes';
import * as api from '../../api';

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

export const fetchUserExerciseStatistics = userId => (dispatch) => {
  dispatch(fetchUserExerciseStatisticsStart());
  api.fetchUserExerciseStatistics(userId)
    .then((userStatistics) => {
      dispatch(fetchUserExerciseStatisticsSucceeded(userStatistics));
    }, (errorMessage) => {
      dispatch(fetchUserExerciseStatisticsFailed(errorMessage));
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

export const fetchGroupExerciseStatistics = groupId => (dispatch) => {
  dispatch(fetchGroupExerciseStatisticsStart());
  api.fetchGroupExerciseStatistics(groupId)
    .then((groupStatistics) => {
      dispatch(fetchGroupExerciseStatisticsSucceeded(groupStatistics));
    }, (errorMessage) => {
      dispatch(fetchGroupExerciseStatisticsFailed(errorMessage));
    });
};
