const attempts = [
  {
    id: 1,
    exerciseId: 1,
    modification: 'default',
    startTime: Date.now(),
    readingTextTitle: 'Reading text',
    userReadingAttemptCount: 1,
    result: {
      wordsPerMinute: 300,
      elapsedTime: 12345,
    },
    test: {
      elapsedTime: 12345,
      testResult: 1,
      correct: 1,
      incorrect: 0,
      unanswered: 0,
      comprehensionResult: 1,
      comprehensionPerMinute: 300,
    },
  },
];

async function getExerciseAttempts(userId) {
  return attempts;
}

async function getExerciseAttemptsGroupedByUserId() {
  return { user1: attempts };
}

export { getExerciseAttempts, getExerciseAttemptsGroupedByUserId };
