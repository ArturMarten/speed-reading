import * as actionTypes from './actionTypes';
import axios from '../../axios-http';

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
  if (userId) {
    axios.get(`/exerciseAttempts?userId=${userId}`)
      .then((response) => {
        dispatch(fetchExerciseStatisticsSucceeded(response.data));
      })
      .catch((error) => {
        dispatch(fetchExerciseStatisticsFailed(error.message));
      });
  } else {
    axios.get('/exerciseAttempts')
      .then((response) => {
        dispatch(fetchExerciseStatisticsSucceeded(response.data));
      })
      .catch((error) => {
        dispatch(fetchExerciseStatisticsFailed(error.message));
      });
  }
};

export default fetchExerciseStatistics;
