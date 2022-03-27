import { achievementData } from './achievementData';
import {
  calculateAchievements,
  calculatePoints,
  diffAchievements,
  getObjectValue,
  mergeDeep,
  dayChanged,
  weekChanged,
  generateTemporalAchievement,
  checkTemporalAchievements,
  isAchievementKey,
  getAchievementKeys,
} from './achievements';

const previousAchievements = {
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
      count: 2,
      time: 150000,
    },
    readingExercise: {
      count: 1,
      time: 120000,
    },
    helpExercise: {
      count: 1,
      time: 30000,
    },
    readingTest: {
      count: 0,
      time: 0,
    },
    readingAid: {
      count: 1,
      time: 120000,
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
    movingWordGroups: {
      count: 0,
      time: 0,
    },
    schulteTables: {
      count: 0,
      time: 0,
    },
    concentration: {
      count: 1,
      time: 30000,
    },
    visualVocabulary: {
      count: 0,
      time: 0,
    },
  },
};

const readingTestAttempt = {
  id: 3044,
  exerciseId: 1,
  exercise: 'readingTest',
  modification: 'default',
  date: new Date('2020-08-20T05:27:44.000Z'),
  readingTextTitle: 'Mis määrab hea ja kurja',
  textReadingAttemptCount: null,
  wordsPerMinute: 1834,
  exerciseResult: null,
  elapsedTime: 21262,
  testElapsedTime: 0,
  testResult: null,
  comprehensionResult: null,
  comprehensionPerMinute: null,
};

const concentrationAttempt = {
  id: 3049,
  exerciseId: 7,
  exercise: 'concentration',
  modification: 'concentration-numbers-only',
  date: new Date('2020-08-20T08:12:42.000Z'),
  exerciseResult: 100,
  msPerSymbolGroup: 2746,
  msPerSymbol: 196,
  elapsedTime: 54923,
  testElapsedTime: 0,
  testResult: null,
  comprehensionResult: null,
  comprehensionPerMinute: null,
};

test('data contains equaling levels and points', () => {
  let maxProgressPoints = 0;
  function testEquals(object, ...keys) {
    const data = object[keys[keys.length - 1]];
    if ('levels' in data || 'points' in data) {
      try {
        expect(data.levels.length).toEqual(data.points.length);
      } catch (e) {
        console.error(`Failing keys: ${keys}`);
        throw e;
      }
      if (keys[0] === 'progress') {
        maxProgressPoints += data.points.reduce((a, b) => a + b, 0);
      }
    } else {
      Object.keys(data).forEach((key) => {
        testEquals(data, ...keys, key);
      });
    }
  }

  testEquals(achievementData, 'daily');
  testEquals(achievementData, 'weekly');
  testEquals(achievementData, 'monthly');
  testEquals(achievementData, 'progress');

  expect(maxProgressPoints).toEqual(1613);

  // console.log('Maximum progress points:', maxProgressPoints);
});

test('calculates achievement points correctly', () => {
  const addedPoints = calculatePoints({ levels: [0, 1], points: [0, 1] }, 0, 1);
  expect(addedPoints).toEqual(1);
});

test('diffs deep same objects correctly', () => {
  const diff = diffAchievements({ unique: { readingTest: true } }, { unique: { readingTest: true } });
  expect(diff).toStrictEqual({});
});

test('diffs deep different correctly', () => {
  const diff = diffAchievements(
    { unique: { readingTest: false }, progress: { exercise: { count: 1 } } },
    { unique: { readingTest: true }, progress: { exercise: { count: 1 } } },
  );
  expect(diff).toStrictEqual({ unique: { readingTest: true } });
});

test('gets object value', () => {
  const value = getObjectValue(achievementData, 'progress.exercise.time.points');
  expect(value).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('merges deep objects', () => {
  const merged = mergeDeep(previousAchievements, {
    progress: { exercise: { count: 2 } },
  });
  expect(merged).toStrictEqual({
    ...previousAchievements,
    progress: {
      ...previousAchievements.progress,
      exercise: {
        count: 2,
        time: previousAchievements.progress.exercise.time,
      },
    },
  });
});

const testDayChangesData = [
  ['2020-08-17T00:00:00.000Z', '2020-08-17T00:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-17T23:59:59.999Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-18T00:00:00.000Z', true],
  ['2020-08-17T23:59:59.999Z', '2020-08-18T00:00:00.000Z', true],
];

test.each(testDayChangesData)('checks day change(%s, %s)', (date1, date2, expected) => {
  expect(dayChanged(new Date(date1), new Date(date2))).toBe(expected);
  expect(dayChanged(new Date(date2), new Date(date1))).toBe(expected);
});

const testWeekChangesData = [
  ['2020-08-17T00:00:00.000Z', '2020-08-17T00:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-17T01:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-17T23:59:59.999Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-18T00:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-18T00:00:00.001Z', false],
  ['2020-08-17T23:59:59.999Z', '2020-08-18T00:00:00.000Z', false],
  ['2020-08-17T01:00:00.000Z', '2020-08-19T00:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-23T00:00:00.000Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-23T23:59:59.999Z', false],
  ['2020-08-17T00:00:00.000Z', '2020-08-24T00:00:00.000Z', true],
  ['2020-08-16T00:00:00.000Z', '2020-08-17T00:00:00.000Z', true],
  ['2020-08-15T00:00:00.000Z', '2020-08-17T00:00:00.000Z', true],
];

test.each(testWeekChangesData)('checks week change(%s, %s)', (date1, date2, expected) => {
  expect(weekChanged(new Date(date1), new Date(date2))).toBe(expected);
  expect(weekChanged(new Date(date2), new Date(date1))).toBe(expected);
});

test('identifies achievement key', () => {
  expect(isAchievementKey('')).toBeFalsy();
  expect(isAchievementKey('progress')).toBeTruthy();
  expect(isAchievementKey('progress.points')).toBeFalsy();
});

test('returns achievement keys', () => {
  expect(getAchievementKeys(previousAchievements)).toStrictEqual([
    'daily.exercise.count',
    'daily.exercise.time',
    'weekly.exercise.count',
    'weekly.exercise.time',
    'monthly.exercise.count',
    'monthly.exercise.time',
    'unique.readingTest',
    'progress.exercise.count',
    'progress.exercise.time',
    'progress.readingExercise.count',
    'progress.readingExercise.time',
    'progress.helpExercise.count',
    'progress.helpExercise.time',
    'progress.readingTest.count',
    'progress.readingTest.time',
    'progress.readingAid.count',
    'progress.readingAid.time',
    'progress.scrolling.count',
    'progress.scrolling.time',
    'progress.disappearing.count',
    'progress.disappearing.time',
    'progress.wordGroups.count',
    'progress.wordGroups.time',
    'progress.verticalReading.count',
    'progress.verticalReading.time',
    'progress.movingWordGroups.count',
    'progress.movingWordGroups.time',
    'progress.schulteTables.count',
    'progress.schulteTables.time',
    'progress.concentration.count',
    'progress.concentration.time',
    'progress.visualVocabulary.count',
    'progress.visualVocabulary.time',
  ]);
});

test('generates daily achievement', () => {
  const generatedAchievement = generateTemporalAchievement('daily');
  expect(generatedAchievement.daily).not.toStrictEqual({});
});

test('works with reading test attempt', () => {
  const checkedPreviousAchievements = checkTemporalAchievements(
    previousAchievements,
    new Date('2020-08-20T05:27:44.000Z'),
  );
  const newAchievements = calculateAchievements(checkedPreviousAchievements, [], readingTestAttempt, false);

  expect(newAchievements.points).toBe(1);
  expect(newAchievements.unique).toStrictEqual({
    ...checkedPreviousAchievements.unique,
    points: 1,
    readingTest: true,
  });
  expect(newAchievements.daily).toStrictEqual({
    ...checkedPreviousAchievements.daily,
    date: new Date('2020-08-20T05:27:44.000Z'),
    exercise: { count: 1, time: readingTestAttempt.elapsedTime },
  });
  expect(newAchievements.weekly).toStrictEqual({
    ...checkedPreviousAchievements.weekly,
    date: new Date('2020-08-20T05:27:44.000Z'),
    exercise: { count: 1, time: readingTestAttempt.elapsedTime },
  });
  expect(newAchievements.monthly).toStrictEqual({
    ...checkedPreviousAchievements.monthly,
    date: new Date('2020-08-20T05:27:44.000Z'),
    exercise: { count: 1, time: readingTestAttempt.elapsedTime },
  });
  expect(newAchievements.progress).toStrictEqual({
    ...checkedPreviousAchievements.progress,
    points: 0,
    exercise: {
      count: previousAchievements.progress.exercise.count + 1,
      time: previousAchievements.progress.exercise.time + readingTestAttempt.elapsedTime,
    },
    readingExercise: {
      count: previousAchievements.progress.readingExercise.count + 1,
      time: previousAchievements.progress.readingExercise.time + readingTestAttempt.elapsedTime,
    },
    readingTest: {
      count: previousAchievements.progress.readingTest.count + 1,
      time: previousAchievements.progress.readingTest.time + readingTestAttempt.elapsedTime,
    },
  });

  const diff = diffAchievements(checkedPreviousAchievements, newAchievements);
  expect(diff).toStrictEqual({
    points: 1,
    unique: { points: 1, readingTest: true },
    daily: {
      exercise: { count: 1, time: readingTestAttempt.elapsedTime },
    },
    weekly: {
      exercise: { count: 1, time: readingTestAttempt.elapsedTime },
    },
    monthly: {
      exercise: { count: 1, time: readingTestAttempt.elapsedTime },
    },
    progress: {
      exercise: {
        count: 1,
        time: readingTestAttempt.elapsedTime,
      },
      readingExercise: {
        count: 1,
        time: readingTestAttempt.elapsedTime,
      },
      readingTest: {
        count: 1,
        time: readingTestAttempt.elapsedTime,
      },
    },
  });
});

test('works with concentration exercise attempt', () => {
  const checkedPreviousAchievements = checkTemporalAchievements(
    previousAchievements,
    new Date('2020-08-20T08:12:42.000Z'),
  );
  const newAchievements = calculateAchievements(checkedPreviousAchievements, [], concentrationAttempt, false);

  expect(newAchievements.points).toBe(1);
  expect(newAchievements.daily).toStrictEqual({
    ...checkedPreviousAchievements.daily,
    date: new Date('2020-08-20T08:12:42.000Z'),
    exercise: { count: 1, time: concentrationAttempt.elapsedTime },
  });
  expect(newAchievements.weekly).toStrictEqual({
    ...checkedPreviousAchievements.weekly,
    date: new Date('2020-08-20T08:12:42.000Z'),
    exercise: { count: 1, time: concentrationAttempt.elapsedTime },
  });
  expect(newAchievements.monthly).toStrictEqual({
    ...checkedPreviousAchievements.monthly,
    date: new Date('2020-08-20T08:12:42.000Z'),
    exercise: { count: 1, time: concentrationAttempt.elapsedTime },
  });
  expect(newAchievements.progress).toStrictEqual({
    ...checkedPreviousAchievements.progress,
    points: 1,
    exercise: {
      count: previousAchievements.progress.exercise.count + 1,
      time: previousAchievements.progress.exercise.time + concentrationAttempt.elapsedTime,
    },
    helpExercise: {
      count: previousAchievements.progress.helpExercise.count + 1,
      time: previousAchievements.progress.helpExercise.time + concentrationAttempt.elapsedTime,
    },
    concentration: {
      count: previousAchievements.progress.concentration.count + 1,
      time: previousAchievements.progress.concentration.time + concentrationAttempt.elapsedTime,
    },
  });

  const diff = diffAchievements(checkedPreviousAchievements, newAchievements);
  expect(diff).toStrictEqual({
    points: 1,
    daily: {
      exercise: { count: 1, time: concentrationAttempt.elapsedTime },
    },
    weekly: {
      exercise: { count: 1, time: concentrationAttempt.elapsedTime },
    },
    monthly: {
      exercise: { count: 1, time: concentrationAttempt.elapsedTime },
    },
    progress: {
      points: 1,
      exercise: { count: 1, time: concentrationAttempt.elapsedTime },
      helpExercise: { count: 1, time: concentrationAttempt.elapsedTime },
      concentration: { count: 1, time: concentrationAttempt.elapsedTime },
    },
  });
});
