import {
  filterReadingExercises,
  filterByAttemptCount,
  getUserCount,
  groupDataByExercise,
  calculateExerciseResults,
  aggerateExerciseResults,
} from './groupTable';

it('filters by exercise', () => {
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

it('filters by attempt count', () => {
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

it('calculates user count', () => {
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

it('groups data by exercise', () => {
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

it('calculates exercise results', () => {
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
        exerciseCount: 1,
        exerciseElapsedTime: 90000,
        initialReadingSpeed: 90,
        initialComprehensionLevel: 90,
        initialComprehensionSpeed: 81,
        finalReadingSpeed: 90,
        finalComprehensionLevel: 90,
        finalComprehensionSpeed: 81,
        userId: 'user2',
      },
    ],
    readingExercises: [
      {
        exerciseCount: 1,
        exerciseElapsedTime: 85000,
        initialReadingSpeed: 120,
        initialComprehensionLevel: 80,
        initialComprehensionSpeed: 96,
        finalReadingSpeed: 120,
        finalComprehensionLevel: 80,
        finalComprehensionSpeed: 96,
        userId: 'user1',
      },
      {
        exerciseCount: 1,
        exerciseElapsedTime: 90000,
        initialReadingSpeed: 90,
        initialComprehensionLevel: 90,
        initialComprehensionSpeed: 81,
        finalReadingSpeed: 90,
        finalComprehensionLevel: 90,
        finalComprehensionSpeed: 81,
        userId: 'user2',
      },
    ],
    readingTest: [
      {
        exerciseCount: 1,
        exerciseElapsedTime: 85000,
        initialReadingSpeed: 120,
        finalComprehensionLevel: 80,
        finalComprehensionSpeed: 96,
        finalReadingSpeed: 120,
        initialComprehensionLevel: 80,
        initialComprehensionSpeed: 96,
        userId: 'user1',
      },
    ],
  });
});

it('aggregates exercise results', () => {
  const result = aggerateExerciseResults([]);
  expect(result).toEqual({});
});
