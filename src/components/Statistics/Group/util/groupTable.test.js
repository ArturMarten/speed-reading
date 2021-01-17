import {
  filterReadingExercises,
  filterByAttemptCount,
  getUserCount,
  groupDataByExercise,
  calculateExerciseResults,
  groupDataByReadingExercise,
} from './groupTable';

test('filters by exercise', () => {
  const result = filterReadingExercises({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
    ],
    user2: [
      {
        id: 2,
        exercise: 'schulteTables',
      },
    ],
  });
  expect(result).toEqual({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
    ],
    user2: [],
  });
});

test('filters by attempt count', () => {
  const result = filterByAttemptCount(
    {
      user1: [
        {
          id: 1,
          exercise: 'readingTest',
          wordsPerMinute: 120,
        },
        {
          id: 2,
          exercise: 'readingAid',
          wordsPerMinute: 100,
        },
      ],
      user2: [
        {
          id: 3,
          exercise: 'schulteTables',
        },
      ],
    },
    2,
  );
  expect(result).toEqual({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
      {
        id: 2,
        exercise: 'readingAid',
        wordsPerMinute: 100,
      },
    ],
    user2: [],
  });
});

test('calculates user count', () => {
  const userCount = getUserCount({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
    ],
    user2: [],
  });
  expect(userCount).toBe(1);
});

test('groups data by exercise', () => {
  const result = groupDataByReadingExercise({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
    ],
  });
  expect(result).toEqual([
    {
      readingTest: [
        {
          id: 1,
          index: 1,
          userId: 'user1',
          wordsPerMinute: 120,
          exercise: 'readingTest',
        },
      ],
      readingExercises: [
        {
          id: 1,
          index: 1,
          userId: 'user1',
          wordsPerMinute: 120,
          exercise: 'readingTest',
        },
      ],
    },
  ]);
});

test('groups data by exercise', () => {
  const result = groupDataByExercise({
    user1: [
      {
        id: 1,
        exercise: 'readingTest',
        wordsPerMinute: 120,
      },
    ],
  });
  expect(result).toEqual([
    {
      readingTest: [
        {
          id: 1,
          index: 1,
          userId: 'user1',
          wordsPerMinute: 120,
          exercise: 'readingTest',
        },
      ],
    },
  ]);
});

test('calculates exercise results', () => {
  const result = calculateExerciseResults([
    {
      readingTest: [
        {
          id: 1,
          index: 1,
          userId: 'user1',
          exercise: 'readingTest',
          elapsedTime: 85000,
          wordsPerMinute: 120,
          comprehensionResult: 80,
          comprehensionPerMinute: 96,
        },
      ],
      readingAid: [
        {
          id: 2,
          index: 2,
          userId: 'user2',
          exercise: 'readingAid',
          elapsedTime: 90000,
          wordsPerMinute: 90,
          comprehensionResult: 90,
          comprehensionPerMinute: 81,
        },
      ],
    },
  ]);
  expect(result).toEqual({
    readingAid: [
      {
        exercise: 'readingAid',
        exerciseCount: 1,
        exerciseElapsedTime: 90000,
        initialReadingSpeed: 90,
        initialComprehensionLevel: 90,
        initialComprehensionSpeed: 81,
        finalReadingSpeed: 90,
        finalComprehensionLevel: 90,
        finalComprehensionSpeed: 81,
        readingSpeedChange: 0,
        comprehensionLevelChange: 0,
        comprehensionSpeedChange: 0,
        userId: 'user2',
      },
    ],
    readingTest: [
      {
        exercise: 'readingTest',
        exerciseCount: 1,
        exerciseElapsedTime: 85000,
        initialReadingSpeed: 120,
        finalComprehensionLevel: 80,
        finalComprehensionSpeed: 96,
        finalReadingSpeed: 120,
        initialComprehensionLevel: 80,
        initialComprehensionSpeed: 96,
        readingSpeedChange: 0,
        comprehensionLevelChange: 0,
        comprehensionSpeedChange: 0,
        userId: 'user1',
      },
    ],
  });
});
