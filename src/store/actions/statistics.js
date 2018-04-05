import * as actionTypes from './actionTypes';
import axios from '../../axios-http';
import { serverErrorMessage } from '../../shared/utility';

const fetchExerciseStatisticsStart = () => ({
  type: actionTypes.FETCH_EXERCISE_STATISTICS_START,
});

const fetchExerciseStatisticsSucceeded = exercisesStatistics => ({
  type: actionTypes.FETCH_EXERCISE_STATISTICS_SUCCEEDED,
  payload: exercisesStatistics,
});

const fetchExerciseStatisticsFailed = error => ({
  type: actionTypes.FETCH_EXERCISE_STATISTICS_FAILED,
  payload: error,
});

export const fetchExerciseStatistics = userId => (dispatch) => {
  dispatch(fetchExerciseStatisticsStart());
  axios.get(`/exerciseAttempts?userId=${userId}&embed=test`)
    .then((response) => {
      dispatch(fetchExerciseStatisticsSucceeded(response.data));
    }, (error) => {
      dispatch(fetchExerciseStatisticsFailed(serverErrorMessage(error)));
    })
    .catch((error) => {
      dispatch(fetchExerciseStatisticsFailed(error.message));
    });
};

export default fetchExerciseStatistics;
