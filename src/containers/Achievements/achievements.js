import { formatMillisecondsInHours, formatMillisecondsInText } from '../../shared/utility';
import { exerciseAttemptResultFilter, exerciseAttemptMap } from '../../store/reducers/statistics';
import * as api from '../../api';
import { achievementData } from './achievementData';

const readingExercises = ['readingTest', 'readingAid', 'scrolling', 'disappearing', 'wordGroups', 'verticalReading'];

export const initialAchievements = {
  points: 0,
  daily: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  weekly: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  monthly: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  unique: {
    points: 0,
    readingTest: false,
  },
  progress: {
    points: 0,
    exercise: {
      count: 0,
      time: 0,
    },
    readingExercise: {
      count: 0,
      time: 0,
    },
    helpExercise: {
      count: 0,
      time: 0,
    },
    readingTest: {
      count: 0,
      time: 0,
    },
    readingAid: {
      count: 0,
      time: 0,
    },
    scrolling: {
      count: 0,
      time: 0,
    },
    disappearing: {
      count: 0,
      time: 0,
    },
    wordGroups: {
      count: 0,
      time: 0,
    },
    verticalReading: {
      count: 0,
      time: 0,
    },
    schulteTables: {
      count: 0,
      time: 0,
    },
    concentration: {
      count: 0,
      time: 0,
    },
  },
};

export const findLastIndex = (array, predicate) => {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    const item = array[index];
    if (predicate(item)) {
      return index;
    }
  }
  return -1;
};

export const getObjectValue = (object, key) => {
  const [property, ...properties] = key.split('.');
  if (object[property] !== undefined) {
    if (properties.length === 0) {
      return object[property];
    }
    return getObjectValue(object[property], properties.join('.'));
  }
  return null;
};

const deepClone = (object) => {
  return JSON.parse(JSON.stringify(object)); // TODO: Find a better way for deep clone
};

const isObject = (object) => object && typeof object === 'object';
const isArray = (object) => Array.isArray(object);
const isEmptyObject = (object) => Object.keys(object).length === 0 && object.constructor === Object;

export const mergeDeep = (target, source) => {
  const result = deepClone(target);
  if (!isObject(result) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isArray(targetValue) && isArray(sourceValue)) {
      result[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      result[key] = mergeDeep(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  });

  return result;
};

const countColor = '#21ba45';
const timeColor = '#2185d0';

export const getAchievementData = (achievementKey) => {
  const achievementKeys = achievementKey.split('.');
  const achievementType = achievementKeys[0];
  if (achievementKeys[achievementKeys.length - 1] === 'time') {
    return {
      achievementType,
      color: timeColor,
      formatter: formatMillisecondsInHours,
      textFormatter: formatMillisecondsInText,
    };
  }
  return {
    achievementType,
    color: countColor,
    formatter: null,
    textFormatter: null,
  };
};

export const isAchievementKey = (key) => {
  return getObjectValue(achievementData, key) !== null;
};

export const getAchievementKeys = (achievementObject) => {
  const result = [];
  const addKeys = (object, objectKeys = []) => {
    if (!object) return;
    Object.keys(object).forEach((key) => {
      const property = object[key];
      const keys = [...objectKeys, key];
      if (isObject(property) || isArray(property)) {
        addKeys(property, keys);
      } else {
        result.push(keys.join('.'));
      }
    });
  };
  addKeys(achievementObject);
  return result.filter((key) => isAchievementKey(key));
};

export const getCategoryAchievementKeys = (achievementObject, category) => {
  return getAchievementKeys(achievementObject).filter((key) => key.split('.')[0] === category);
};

export const calculatePoints = (data, currentValue, added) => {
  const { levels, points } = data;
  const currentLevelIndex = findLastIndex(levels, (levelValue) => currentValue >= levelValue);
  if (currentLevelIndex === levels.length - 1) return 0;
  const newValue = currentValue + added;
  const nextLevelIndex = currentLevelIndex + 1;
  if (newValue >= levels[nextLevelIndex]) {
    return points[nextLevelIndex];
  }
  return 0;
};

export const increment = (achievements, category) => (type, time) => {
  const incremented = {};
  let addedPoints = 0;
  if (achievements[category] && achievements[category][type]) {
    if ('count' in achievements[category][type]) {
      // Increment count
      incremented.count = achievements[category][type].count + 1;
      addedPoints += calculatePoints(achievementData[category][type].count, achievements[category][type].count, 1);
    }
    if ('time' in achievements[category][type]) {
      // Increment time
      incremented.time = achievements[category][type].time + time;
      addedPoints += calculatePoints(achievementData[category][type].time, achievements[category][type].time, time);
    }
  }
  return [incremented, addedPoints];
};

export const diffAchievements = (previous, next) => {
  /* eslint-disable no-param-reassign */
  if (typeof previous === 'object') {
    return Object.keys(previous).reduce((diff, key) => {
      if (previous[key] === null) {
        return {};
      }
      if (typeof previous[key] === 'object') {
        const diffResult = diffAchievements(previous[key], next[key]);
        if (Object.keys(diffResult).length !== 0) {
          diff[key] = diffResult;
        }
      } else if (previous[key] !== next[key]) {
        if (typeof previous[key] === 'number') {
          diff[key] = next[key] - previous[key];
        } else {
          diff[key] = next[key];
        }
      }
      return diff;
    }, {});
  }
  return {};
  /* eslint-enable no-param-reassign */
};

export const yearChanged = (date1, date2) => {
  return date1.getUTCFullYear() !== date2.getUTCFullYear();
};

export const monthChanged = (date1, date2) => {
  return date1.getUTCMonth() !== date2.getUTCMonth() || yearChanged(date1, date2);
};

const getWeekDay = (date) => {
  // .getUTCDay() - sunday 0, monday 1, ... => monday 0, ..., sunday 6
  return date.getUTCDay() - 1 !== -1 ? date.getUTCDay() - 1 : 6;
};

const HOURS_24 = 24 * 60 * 60 * 1000;

export const weekChanged = (date1, date2) => {
  const [firstDate, secondDate] = [date1, date2].sort((a, b) => a - b);
  const diffTime = secondDate - firstDate;
  const diffDays = Math.floor(diffTime / HOURS_24);
  const weekDay1 = getWeekDay(firstDate);
  const weekDay2 = getWeekDay(secondDate);
  return diffDays >= 7 || weekDay2 - weekDay1 < 0;
};

export const dayChanged = (date1, date2) => {
  return date1.getUTCDate() !== date2.getUTCDate() || weekChanged(date1, date2);
};

const getArrayRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateTemporalAchievement = (achievementType) => {
  const possibleCategories = Object.keys(achievementData[achievementType]).filter((key) => key !== 'exercise');
  const generatedCategory = getArrayRandom(possibleCategories);
  if (generatedCategory) {
    const possibleTypes = Object.keys(achievementData[achievementType][generatedCategory]);
    const generatedType = getArrayRandom(possibleTypes);
    if (generatedType) {
      return {
        [generatedCategory]: {
          [generatedType]: 0,
        },
      };
    }
  }
  return {};
};

export const checkTemporalAchievements = (achievements, date, updateTemporalUnique = true) => {
  const checkedAchievements = deepClone(achievements);

  // Daily
  const dailyDate = achievements.daily.date && new Date(achievements.daily.date);
  if (!dailyDate || dayChanged(dailyDate, date)) {
    // Reset
    checkedAchievements.daily = {
      ...(!updateTemporalUnique && checkedAchievements.daily),
      points: checkedAchievements.daily.points,
      uniquePoints: checkedAchievements.daily.uniquePoints,
      exercise: {
        count: 0,
        time: 0,
      },
      ...(updateTemporalUnique && generateTemporalAchievement('daily')),
    };
  }

  // Weekly
  const weeklyDate = achievements.weekly.date && new Date(achievements.weekly.date);
  if (!weeklyDate || weekChanged(weeklyDate, date)) {
    // Reset
    checkedAchievements.weekly = {
      ...(!updateTemporalUnique && checkedAchievements.weekly),
      points: checkedAchievements.weekly.points,
      uniquePoints: checkedAchievements.weekly.uniquePoints,
      exercise: {
        count: 0,
        time: 0,
      },
      ...(updateTemporalUnique && generateTemporalAchievement('weekly')),
    };
  }

  // Monthly
  const monthlyDate = achievements.monthly.date && new Date(achievements.monthly.date);
  if (!monthlyDate || monthChanged(monthlyDate, date)) {
    // Reset
    checkedAchievements.monthly = {
      ...(!updateTemporalUnique && checkedAchievements.monthly),
      points: checkedAchievements.monthly.points,
      uniquePoints: checkedAchievements.monthly.uniquePoints,
      exercise: {
        count: 0,
        time: 0,
      },
      ...(updateTemporalUnique && generateTemporalAchievement('monthly')),
    };
  }

  return {
    ...checkedAchievements,
    daily: {
      ...checkedAchievements.daily,
      date,
    },
    weekly: {
      ...checkedAchievements.weekly,
      date,
    },
    monthly: {
      ...checkedAchievements.monthly,
      date,
    },
  };
};

export const calculateAchievements = (previousAchievements, statistics, attempt, updateTemporalUnique = true) => {
  const newAchievements = deepClone(previousAchievements);
  const { exercise, date } = attempt;
  const time = attempt.elapsedTime;
  const exerciseType = readingExercises.indexOf(exercise) !== -1 ? 'readingExercise' : 'helpExercise';

  // Unique
  let uniquePoints = 0;
  if (!newAchievements.unique.readingTest && exercise === 'readingTest') {
    uniquePoints += achievementData.unique.readingTest.points;
    newAchievements.unique = {
      ...newAchievements.unique,
      points: newAchievements.unique.points + uniquePoints,
      readingTest: true,
    };
  }

  const checkedTemporalAchievements = checkTemporalAchievements(newAchievements, date, updateTemporalUnique);

  // Daily
  const dailyIncrement = increment(checkedTemporalAchievements, 'daily');
  const [incrementedDailyUnique, dailyUniquePoints] = dailyIncrement(exercise, time);
  const [incrementedDailyUniqueType, dailyUniqueTypePoints] = dailyIncrement(exerciseType, time);
  const [incrementedDailyExercise, dailyExercisePoints] = dailyIncrement('exercise', time);

  const dailyPoints = dailyExercisePoints;
  const uniqueDailyPoints = updateTemporalUnique ? dailyUniquePoints + dailyUniqueTypePoints : 0;
  newAchievements.daily = {
    ...checkedTemporalAchievements.daily,
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedDailyUnique) && {
        [exercise]: incrementedDailyUnique,
      }),
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedDailyUniqueType) && {
        [exerciseType]: incrementedDailyUniqueType,
      }),
    exercise: {
      ...checkedTemporalAchievements.daily.exercise,
      ...incrementedDailyExercise,
    },
    points: checkedTemporalAchievements.daily.points + dailyPoints,
    uniquePoints: checkedTemporalAchievements.daily.uniquePoints + uniqueDailyPoints,
  };

  // Weekly
  const weeklyIncrement = increment(checkedTemporalAchievements, 'weekly');
  const [incrementedWeeklyUnique, weeklyUniquePoints] = weeklyIncrement(exercise, time);
  const [incrementedWeeklyUniqueType, weeklyUniqueTypePoints] = weeklyIncrement(exerciseType, time);
  const [incrementedWeeklyExercise, weeklyExercisePoints] = weeklyIncrement('exercise', time);

  const weeklyPoints = weeklyExercisePoints;
  const uniqueWeeklyPoints = updateTemporalUnique ? weeklyUniquePoints + weeklyUniqueTypePoints : 0;
  newAchievements.weekly = {
    ...checkedTemporalAchievements.weekly,
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedWeeklyUnique) && {
        [exercise]: incrementedWeeklyUnique,
      }),
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedWeeklyUniqueType) && {
        [exerciseType]: incrementedWeeklyUniqueType,
      }),
    exercise: {
      ...checkedTemporalAchievements.weekly.exercise,
      ...incrementedWeeklyExercise,
    },
    points: checkedTemporalAchievements.weekly.points + weeklyPoints,
    uniquePoints: checkedTemporalAchievements.weekly.uniquePoints + uniqueWeeklyPoints,
  };

  // Monthly
  const monthlyIncrement = increment(checkedTemporalAchievements, 'monthly');
  const [incrementedMonthlyUnique, monthlyUniquePoints] = monthlyIncrement(exercise, time);
  const [incrementedMonthlyUniqueType, monthlyUniqueTypePoints] = monthlyIncrement(exerciseType, time);
  const [incrementedMonthlyExercise, monthlyExercisePoints] = monthlyIncrement('exercise', time);

  const monthlyPoints = monthlyExercisePoints;
  const uniqueMonthlyPoints = updateTemporalUnique ? monthlyUniquePoints + monthlyUniqueTypePoints : 0;
  newAchievements.monthly = {
    ...checkedTemporalAchievements.monthly,
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedMonthlyUnique) && {
        [exercise]: incrementedMonthlyUnique,
      }),
    ...(updateTemporalUnique &&
      !isEmptyObject(incrementedMonthlyUniqueType) && {
        [exerciseType]: incrementedMonthlyUniqueType,
      }),
    exercise: {
      ...checkedTemporalAchievements.monthly.exercise,
      ...incrementedMonthlyExercise,
    },
    points: checkedTemporalAchievements.monthly.points + monthlyPoints,
    uniquePoints: checkedTemporalAchievements.monthly.uniquePoints + uniqueMonthlyPoints,
  };

  // Progress
  const progressIncrement = increment(newAchievements, 'progress');
  const [incrementedExerciseName, exerciseNamePoints] = progressIncrement(exercise, time);
  const [incrementedExerciseType, exerciseTypePoints] = progressIncrement(exerciseType, time);
  const [incrementedExercise, exercisePoints] = progressIncrement('exercise', time);

  const progressPoints = exerciseNamePoints + exerciseTypePoints + exercisePoints;

  newAchievements.progress = {
    ...newAchievements.progress,
    [exercise]: {
      ...newAchievements.progress[exercise],
      ...incrementedExerciseName,
    },
    [exerciseType]: {
      ...newAchievements.progress[exerciseType],
      ...incrementedExerciseType,
    },
    exercise: {
      ...newAchievements.progress.exercise,
      ...incrementedExercise,
    },
    points: newAchievements.progress.points + progressPoints,
  };
  newAchievements.points += uniquePoints + dailyPoints + weeklyPoints + monthlyPoints + progressPoints;

  return newAchievements;
};

const getAchievementPercent = (min, max, value) => {
  if (min !== max) {
    return Math.floor(((value - min) * 100) / (max - min)) || 0;
  }
  return Math.floor((value * 100) / min);
};

export const getAchievement = (achievements, achievementKey) => {
  const achievementKeys = achievementKey.split('.');
  const achievementType = achievementKeys[0];
  const progress = getObjectValue(achievements, achievementKey);
  const { levels, points } = getObjectValue(achievementData, achievementKey);
  const currentLevel = findLastIndex(levels, (levelValue) => progress >= levelValue);
  const nextLevel = currentLevel + 1;
  const lastProgress = levels[currentLevel];
  const nextProgress = levels[nextLevel] || lastProgress;
  const currentPoints = points.slice(0, nextLevel).reduce((a, b) => a + b, 0);
  const nextPoints = points[nextLevel] || 0;
  const totalPoints = points.reduce((a, b) => a + b, 0);
  const percent = getAchievementPercent(0, nextProgress, progress);
  return {
    achievementKey,
    achievementType,
    percent,
    progress,
    currentLevel,
    lastProgress,
    nextProgress,
    currentPoints,
    nextPoints,
    totalPoints,
  };
};

export const updateUserAchievements = (userData) => {
  return new Promise((resolve, reject) => {
    console.log('Updating achievements for user', userData);
    const { publicId: userId, achievements: currentAchievements } = userData;
    console.log('current', currentAchievements);
    api.fetchUserExerciseStatistics(userId).then(
      (exerciseStatistics) => {
        const attempts = exerciseStatistics.filter(exerciseAttemptResultFilter).map(exerciseAttemptMap);
        let updatedAchievements = JSON.parse(JSON.stringify(initialAchievements));
        console.log('before', updatedAchievements);
        if (attempts) {
          attempts.forEach((attempt) => {
            const newAchievements = calculateAchievements(updatedAchievements, attempts, attempt, false);
            updatedAchievements = newAchievements;
          });
          console.log('updated', updatedAchievements);
          let checkedAchievements = deepClone(updatedAchievements);
          if (currentAchievements === null) {
            checkedAchievements.daily = {
              ...checkedAchievements.daily,
              ...generateTemporalAchievement('daily'),
            };
            checkedAchievements.weekly = {
              ...checkedAchievements.weekly,
              ...generateTemporalAchievement('weekly'),
            };
            checkedAchievements.monthly = {
              ...checkedAchievements.monthly,
              ...generateTemporalAchievement('monthly'),
            };
            checkedAchievements = checkTemporalAchievements(checkedAchievements, new Date());
          } else {
            checkedAchievements.daily = {
              ...currentAchievements.daily,
              points: checkedAchievements.daily.points,
              uniquePoints: currentAchievements.daily.uniquePoints,
              exercise: checkedAchievements.daily.exercise,
              date: currentAchievements.daily.date,
            };
            checkedAchievements.weekly = {
              ...currentAchievements.weekly,
              points: checkedAchievements.weekly.points,
              uniquePoints: currentAchievements.weekly.uniquePoints,
              exercise: checkedAchievements.weekly.exercise,
              date: currentAchievements.weekly.date,
            };
            checkedAchievements.monthly = {
              ...currentAchievements.monthly,
              points: checkedAchievements.monthly.points,
              uniquePoints: currentAchievements.monthly.uniquePoints,
              exercise: checkedAchievements.monthly.exercise,
              date: currentAchievements.monthly.date,
            };
            checkedAchievements = checkTemporalAchievements(checkedAchievements, new Date());
          }
          console.log('after', checkedAchievements);
          const userProfileData = { achievements: checkedAchievements };
          api.saveUserProfile({ userId, userProfileData }).then(
            () => {
              console.log('User achievements saved');
              resolve(checkedAchievements);
            },
            (errorMessage) => {
              reject(errorMessage);
            },
          );
        }
      },
      (errorMessage) => {
        reject(errorMessage);
      },
    );
  });
};
