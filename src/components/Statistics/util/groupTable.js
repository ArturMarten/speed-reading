import { leastSquares, getAverage, reduceSumFunc, formatMillisecondsInHours } from '../../../shared/utility';

export const readingExerciseNames = [
  'readingExercises',
  'readingTest',
  'readingAid',
  'scrolling',
  'disappearing',
  'wordGroups',
];

export const helpExerciseNames = ['schulteTables', 'concentration'];

const filterByExercise = (data, attemptFilter) => {
  return Object.keys(data).reduce((previousUsers, userId) => {
    const filteredAttempts = data[userId].filter(attemptFilter);
    return { ...previousUsers, [userId]: filteredAttempts };
  }, {});
};

export const filterByAttemptCount = (data, attemptCount) => {
  return Object.assign(
    {},
    ...Object.keys(data).map((userId) => ({
      [userId]: data[userId].length >= attemptCount ? data[userId] : [],
    })),
  );
};

export const filterReadingExercises = (data) => {
  return filterByExercise(data, (attempt) => readingExerciseNames.indexOf(attempt.exercise) !== -1);
};

export const filterHelpExercises = (data) => {
  return filterByExercise(data, (attempt) => helpExerciseNames.indexOf(attempt.exercise) !== -1);
};

export const getUserCount = (data) => {
  return Object.keys(data).filter((userId) => data[userId].length > 0).length;
};

export const groupDataByExercise = (data) =>
  Object.keys(data).reduce(
    (prevUserArray, currentUserId) =>
      prevUserArray.concat(
        data[currentUserId].reduce((prevExercisesObject, currentAttempt) => {
          if (prevExercisesObject[currentAttempt.exercise]) {
            return {
              ...prevExercisesObject,
              [currentAttempt.exercise]: prevExercisesObject[currentAttempt.exercise].concat({
                ...currentAttempt,
                index: prevExercisesObject[currentAttempt.exercise].length + 1,
                userId: currentUserId,
              }),
            };
          }
          return {
            ...prevExercisesObject,
            [currentAttempt.exercise]: [
              {
                ...currentAttempt,
                index: 1,
                userId: currentUserId,
              },
            ],
          };
        }, {}),
      ),
    [],
  );

export const calculateExerciseResults = (exerciseData) =>
  exerciseData.reduce(
    (prevExercises, userExercises) => {
      const { readingExercises, ...rest } = Object.keys(userExercises).reduce(
        (prevUserExercises, currentExercise) => {
          const attempts = userExercises[currentExercise];
          const { userId } = attempts[0];
          const exerciseCount = attempts.length;
          const exerciseElapsedTime = attempts.map(({ elapsedTime }) => elapsedTime).reduce(reduceSumFunc, 0);
          const indeces = attempts.map((attempt) => attempt.index);
          const finalIndex = Math.max(...indeces);
          const isReadingExercise = readingExerciseNames.indexOf(currentExercise) !== -1;
          let userExerciseResults = {
            userId,
            exerciseCount,
            exerciseElapsedTime,
          };
          if (isReadingExercise) {
            const readingSpeedResults = attempts.map((attempt) => attempt.wordsPerMinute);
            const [readingSpeedSlope, readingSpeedIntercept] = leastSquares(indeces, readingSpeedResults);
            const initialReadingSpeed = readingSpeedIntercept + readingSpeedSlope;
            const finalReadingSpeed = readingSpeedIntercept + readingSpeedSlope * finalIndex;

            const comprehensionSpeedResults = attempts.map((attempt) => attempt.comprehensionPerMinute);
            const [comprehensionSpeedSlope, comprehensionSpeedIntercept] = leastSquares(
              indeces,
              comprehensionSpeedResults,
            );
            const initialComprehensionSpeed = comprehensionSpeedIntercept + comprehensionSpeedSlope;
            const finalComprehensionSpeed = comprehensionSpeedIntercept + comprehensionSpeedSlope * finalIndex;

            const comprehensionLevelResults = attempts.map((attempt) => attempt.comprehensionResult);
            const [comprehensionLevelSlope, comprehensionLevelIntercept] = leastSquares(
              indeces,
              comprehensionLevelResults,
            );
            const initialComprehensionLevel = comprehensionLevelIntercept + comprehensionLevelSlope;
            const finalComprehensionLevel = comprehensionLevelIntercept + comprehensionLevelSlope * finalIndex;

            userExerciseResults = {
              ...userExerciseResults,
              initialReadingSpeed,
              finalReadingSpeed,
              initialComprehensionSpeed,
              finalComprehensionSpeed,
              initialComprehensionLevel,
              finalComprehensionLevel,
            };
          } else {
            const exerciseSpeedResults = attempts.map((attempt) => attempt.symbolsPerMinute);
            const [exerciseSpeedSlope, exerciseSpeedIntercept] = leastSquares(indeces, exerciseSpeedResults);
            const initialExerciseSpeed = exerciseSpeedIntercept + exerciseSpeedSlope;
            const finalExerciseSpeed = exerciseSpeedIntercept + exerciseSpeedSlope * finalIndex;
            userExerciseResults = {
              ...userExerciseResults,
              initialExerciseSpeed,
              finalExerciseSpeed,
            };
          }

          return {
            ...prevUserExercises,
            [currentExercise]: prevExercises[currentExercise]
              ? prevExercises[currentExercise].concat(userExerciseResults)
              : [userExerciseResults],
            readingExercises: isReadingExercise
              ? prevUserExercises.readingExercises.concat(userExerciseResults)
              : prevUserExercises.readingExercises,
          };
        },
        { readingExercises: [] },
      );
      return {
        ...prevExercises,
        readingExercises: prevExercises.readingExercises.concat(...readingExercises),
        ...rest,
      };
    },
    { readingExercises: [] },
  );

export const calculateReadingExerciseResults = (exerciseData) => {
  return calculateExerciseResults(exerciseData); // TODO
};

export const calculateHelpExerciseResults = (exerciseData) => {
  return calculateExerciseResults(exerciseData); // TODO
};

export const aggerateExerciseResults = (results, userCount) =>
  Object.keys(results).reduce((prevExercisesResults, currentExercise) => {
    const exerciseResults = results[currentExercise];
    if (exerciseResults.length === 0) {
      return prevExercisesResults;
    }
    const totalExerciseCount = exerciseResults.map(({ exerciseCount }) => exerciseCount).reduce(reduceSumFunc, 0);
    const totalExerciseElapsedTime = exerciseResults
      .map(({ exerciseElapsedTime }) => exerciseElapsedTime)
      .reduce(reduceSumFunc, 0);
    const averageExerciseCount = totalExerciseCount / userCount;
    const isReadingExercise = readingExerciseNames.indexOf(currentExercise) !== -1;
    let aggregatedResult = {
      totalExerciseCount,
      totalExerciseElapsedTime,
      averageExerciseCount,
    };
    if (isReadingExercise) {
      const averageInitialReadingSpeed = getAverage(
        exerciseResults.map(({ initialReadingSpeed }) => initialReadingSpeed),
      );
      const averageFinalReadingSpeed = getAverage(exerciseResults.map(({ finalReadingSpeed }) => finalReadingSpeed));
      const averageReadingSpeedChange = averageFinalReadingSpeed - averageInitialReadingSpeed;
      const averageReadingSpeedChangePercentage = (averageReadingSpeedChange / averageInitialReadingSpeed) * 100;

      const averageInitialComprehensionSpeed = getAverage(
        exerciseResults.map(({ initialComprehensionSpeed }) => initialComprehensionSpeed),
      );
      const averageFinalComprehensionSpeed = getAverage(
        exerciseResults.map(({ finalComprehensionSpeed }) => finalComprehensionSpeed),
      );
      const averageComprehensionSpeedChange = averageFinalComprehensionSpeed - averageInitialComprehensionSpeed;
      const averageComprehensionSpeedChangePercentage =
        (averageComprehensionSpeedChange / averageInitialComprehensionSpeed) * 100;

      const averageInitialComprehensionLevel = getAverage(
        exerciseResults.map(({ initialComprehensionLevel }) => initialComprehensionLevel),
      );
      const averageFinalComprehensionLevel = getAverage(
        exerciseResults.map(({ finalComprehensionLevel }) => finalComprehensionLevel),
      );
      const averageComprehensionLevelChange = averageFinalComprehensionLevel - averageInitialComprehensionLevel;
      const averageComprehensionLevelChangePercentage =
        (averageComprehensionLevelChange / averageInitialComprehensionLevel) * 100;
      aggregatedResult = {
        ...aggregatedResult,
        averageInitialReadingSpeed,
        averageFinalReadingSpeed,
        averageReadingSpeedChangePercentage,
        averageInitialComprehensionSpeed,
        averageFinalComprehensionSpeed,
        averageComprehensionSpeedChangePercentage,
        averageInitialComprehensionLevel,
        averageFinalComprehensionLevel,
        averageComprehensionLevelChangePercentage,
      };
    } else {
      const averageInitialExerciseSpeed = getAverage(
        exerciseResults.map(({ initialExerciseSpeed }) => initialExerciseSpeed),
      );
      const averageFinalExerciseSpeed = getAverage(exerciseResults.map(({ finalExerciseSpeed }) => finalExerciseSpeed));
      const averageExerciseSpeedChange = averageFinalExerciseSpeed - averageInitialExerciseSpeed;
      const averageExerciseSpeedChangePercentage = (averageExerciseSpeedChange / averageInitialExerciseSpeed) * 100;
      aggregatedResult = {
        ...aggregatedResult,
        averageInitialExerciseSpeed,
        averageFinalExerciseSpeed,
        averageExerciseSpeedChangePercentage,
      };
    }

    return {
      ...prevExercisesResults,
      [currentExercise]: aggregatedResult,
    };
  }, {});

export const aggregateReadingExerciseResults = (results, userCount) => {
  return aggerateExerciseResults(results, userCount); // TODO
};

export const aggregateHelpExerciseResults = (results, userCount) => {
  return aggerateExerciseResults(results, userCount); // TODO
};

export const exerciseTranslateMapping = {
  readingExercises: 'reading-exercises',
  readingTest: 'reading-test',
  readingAid: 'reading-aid',
  scrolling: 'scrolling-text',
  disappearing: 'disappearing-text',
  wordGroups: 'word-groups',
  schulteTables: 'schulte-tables',
  concentration: 'concentration',
};

const columns = [
  'userId',
  'exerciseName',
  'exerciseCount',
  'exerciseElapsedTime',
  'initialReadingSpeed',
  'finalReadingSpeed',
  'readingSpeedChange',
  'readingSpeedChangePercentage',
  'initialComprehensionSpeed',
  'finalComprehensionSpeed',
  'comprehensionSpeedChange',
  'comprehensionSpeedChangePercentage',
  'initialComprehensionLevel',
  'finalComprehensionLevel',
  'comprehensionLevelChange',
  'comprehensionLevelChangePercentage',
];

export const prepareResults = (results, translate) => {
  const now = new Date();
  const filename = `data_${now.toLocaleDateString()}_${now.toLocaleTimeString()}`;
  const filetype = 'xlsx';

  const rows = Object.keys(results).reduce((prevResults, exerciseName) => {
    if (readingExerciseNames.indexOf(exerciseName) === -1 || exerciseName === 'readingExercises') {
      return [...prevResults];
    }
    const currentResults = results[exerciseName].map((result) => {
      const exerciseElapsedTime = formatMillisecondsInHours(result.exerciseElapsedTime);
      const initialReadingSpeed = +result.initialReadingSpeed.toFixed(0);
      const finalReadingSpeed = +result.finalReadingSpeed.toFixed(0);
      const readingSpeedChange = +(result.finalReadingSpeed - result.initialReadingSpeed).toFixed(2);
      const readingSpeedChangePercentage = +((readingSpeedChange / result.initialReadingSpeed) * 100).toFixed(2);
      const initialComprehensionSpeed = +result.initialComprehensionSpeed.toFixed(0);
      const finalComprehensionSpeed = +result.finalComprehensionSpeed.toFixed(0);
      const comprehensionSpeedChange = +(result.finalComprehensionSpeed - result.initialComprehensionSpeed).toFixed(0);
      const comprehensionSpeedChangePercentage = +(
        (comprehensionSpeedChange / result.initialComprehensionSpeed) *
        100
      ).toFixed(2);
      const initialComprehensionLevel = +result.initialComprehensionLevel.toFixed(0);
      const finalComprehensionLevel = +result.finalComprehensionLevel.toFixed(0);
      const comprehensionLevelChange = +(result.finalComprehensionLevel - result.initialComprehensionLevel).toFixed(0);
      const comprehensionLevelChangePercentage = +(
        (comprehensionLevelChange / result.initialComprehensionLevel) *
        100
      ).toFixed(2);
      return {
        ...result,
        exerciseName: translate(`statistics.${exerciseTranslateMapping[exerciseName]}`),
        exerciseElapsedTime,
        initialReadingSpeed,
        finalReadingSpeed,
        readingSpeedChange,
        initialComprehensionSpeed,
        finalComprehensionSpeed,
        readingSpeedChangePercentage,
        comprehensionSpeedChange,
        comprehensionSpeedChangePercentage,
        initialComprehensionLevel,
        finalComprehensionLevel,
        comprehensionLevelChange,
        comprehensionLevelChangePercentage,
      };
    });
    return [...prevResults, ...currentResults];
  }, []);
  const headings = {
    userId: 'Identifikaator',
    exerciseCount: translate('group-statistics-table.total-exercise-count'),
    exerciseName: translate('group-statistics-table.exercise'),
    exerciseElapsedTime: translate('group-statistics-table.total-exercise-elapsed-time'),
    initialReadingSpeed: 'Lugemise algkiirus',
    finalReadingSpeed: 'Lugemise lõppkiirus',
    readingSpeedChange: 'Lugemiskiiruse muutus',
    readingSpeedChangePercentage: 'Lugemiskiiruse muutus %',
    initialComprehensionSpeed: 'Omandamise algkiirus',
    finalComprehensionSpeed: 'Omandamise lõppkiirus',
    comprehensionSpeedChange: 'Omandamiskiiruse muutus',
    comprehensionSpeedChangePercentage: 'Omandamiskiiruse muutus %',
    initialComprehensionLevel: 'Algne omandamistase',
    finalComprehensionLevel: 'Lõpp omandamistase',
    comprehensionLevelChange: 'Omandamistaseme muutus',
    comprehensionLevelChangePercentage: 'Omandamistaseme muutus %',
  };
  return {
    filename,
    filetype,
    columns,
    rows,
    headings,
  };
};
