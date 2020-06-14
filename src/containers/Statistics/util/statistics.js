import { getAverage, getStandardDeviation } from '../../../shared/utility';
import { getExerciseStatisticsIds } from '../../../store/reducers/exercise';

export const MIN_ATTEMPT_TIME = 10000; // in ms
export const WPM_CHANGE_DATE = new Date('2019-04-02T00:00:00Z');
export const DEVIATION_SIGMA = 3;

export const getPeriodTime = (period) => {
  switch (period) {
    case 'one-day':
      return 24 * 60 * 60 * 1000;
    case 'one-week':
      return 7 * 24 * 60 * 60 * 1000;
    case 'two-weeks':
      return 14 * 24 * 60 * 60 * 1000;
    case 'three-weeks':
      return 21 * 24 * 60 * 60 * 1000;
    case 'one-month':
      return 30.4398 * 24 * 60 * 60 * 1000;
    case 'three-months':
      return 91.3194 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

export const upperBoundOutlierFilter = (attempt) =>
  !attempt.wordsPerMinute ||
  attempt.wordsPerMinute <= 500 ||
  (attempt.wordsPerMinute <= 700 && attempt.date >= WPM_CHANGE_DATE);

export const lowerBoundOutlierFilter = (attempt) =>
  (attempt.elapsedTime === null || attempt.elapsedTime >= MIN_ATTEMPT_TIME) &&
  (attempt.exerciseResult === null || attempt.exerciseResult > 0);

export const standardDeviationOutlierFilter = (min, max) => (attempt) =>
  (!attempt.wordsPerMinute || (attempt.wordsPerMinute >= min && attempt.wordsPerMinute <= max)) &&
  (!attempt.symbolsPerMinute || (attempt.symbolsPerMinute >= min && attempt.symbolsPerMinute <= max)) &&
  (!attempt.exerciseResult || (attempt.exerciseResult >= min && attempt.exerciseResult <= max));

export const timeFilterByStartEnd = (startTime, endTime) => (attempt) =>
  attempt.date >= new Date(startTime) && attempt.date <= new Date(`${endTime}T23:59:59Z`);

export const filterStandardDeviation = (exercise, attempts) => {
  const exerciseAttempts = attempts.filter(
    (attempt) => getExerciseStatisticsIds(exercise).indexOf(attempt.exerciseId) !== -1,
  );

  const values = exerciseAttempts.map(
    (attempt) => attempt.wordsPerMinute || attempt.symbolsPerMinute || attempt.exerciseResult,
  );
  const average = getAverage(values);
  const standardDeviation = getStandardDeviation(values, average);
  const deviation = DEVIATION_SIGMA * standardDeviation;
  const minDeviation = average - deviation;
  const maxDeviation = average + deviation;
  const standardDeviationFilter = standardDeviationOutlierFilter(minDeviation, maxDeviation);

  return exerciseAttempts.filter((attempt) => standardDeviationFilter(attempt));
};
