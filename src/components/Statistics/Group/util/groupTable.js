import { readingExerciseNames } from '../../../../containers/Statistics/util/statistics';
import {
  leastSquares,
  getAverage,
  getChangePercentage,
  reduceSumFunc,
  formatMillisecondsInHours,
} from '../../../../shared/utility';

const filterAttempts = (data, attemptFilter) => {
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
  return filterAttempts(data, (attempt) => readingExerciseNames.indexOf(attempt.exercise) !== -1);
};

export const filterOwnTextAttempts = (data, filterOwnTexts) => {
  return filterOwnTexts ? filterAttempts(data, (attempt) => attempt.readingTextTitle !== null) : data;
};

export const filterFirstReadingAttempts = (data, filterFirstReadingAttempt) => {
  return filterFirstReadingAttempt ? filterAttempts(data, (attempt) => attempt.textReadingAttemptCount === 1) : data;
};

export const filterByExerciseName = (data, exerciseName) => {
  return filterAttempts(data, (attempt) => attempt.exercise === exerciseName);
};

export const getUserCount = (data) => {
  return Object.keys(data).filter((userId) => data[userId].length > 0).length;
};

export const groupDataBy = (data, by) =>
  Object.keys(data).reduce(
    (prevUserArray, currentUserId) =>
      prevUserArray.concat(
        data[currentUserId].reduce((prevObject, currentAttempt) => {
          let attempts = [];
          const field = currentAttempt[by];
          if (prevObject[field]) {
            attempts = prevObject[field].concat({
              ...currentAttempt,
              index: prevObject[field].length + 1,
              userId: currentUserId,
            });
          } else {
            attempts = [
              {
                ...currentAttempt,
                index: 1,
                userId: currentUserId,
              },
            ];
          }
          return {
            ...prevObject,
            [field]: attempts,
          };
        }, {}),
      ),
    [],
  );

export const groupDataByModification = (data) => {
  return groupDataBy(data, 'modification');
};

export const groupDataByExercise = (data) => {
  return groupDataBy(data, 'exercise');
};

export const groupDataByReadingExercise = (data) =>
  Object.keys(data).reduce(
    (prevUserArray, currentUserId) =>
      prevUserArray.concat(
        data[currentUserId].reduce((prevObject, currentAttempt) => {
          let exerciseAttempts = [];
          const exerciseName = currentAttempt['exercise'];
          if (prevObject[exerciseName]) {
            exerciseAttempts = prevObject[exerciseName].concat({
              ...currentAttempt,
              index: prevObject[exerciseName].length + 1,
              userId: currentUserId,
            });
          } else {
            exerciseAttempts = [
              {
                ...currentAttempt,
                index: 1,
                userId: currentUserId,
              },
            ];
          }
          let readingExerciseAttempts = [];
          if (prevObject['readingExercises']) {
            readingExerciseAttempts = prevObject['readingExercises'].concat({
              ...currentAttempt,
              index: prevObject['readingExercises'].length + 1,
              userId: currentUserId,
            });
          } else {
            readingExerciseAttempts = [
              {
                ...currentAttempt,
                index: 1,
                userId: currentUserId,
              },
            ];
          }
          return {
            ...prevObject,
            [exerciseName]: exerciseAttempts,
            readingExercises: readingExerciseAttempts,
          };
        }, {}),
      ),
    [],
  );

const calculateFieldResult = (attempts, field) => {
  const fieldResults = attempts.map((attempt) => attempt[field]);
  const indeces = attempts.map((attempt) => attempt.index);
  const finalIndex = Math.max(...indeces, 0);
  const [slope, intercept] = leastSquares(indeces, fieldResults);
  const initialResult = intercept + slope;
  const finalResult = intercept + slope * finalIndex;
  const resultChange = finalResult - initialResult;
  return [initialResult, finalResult, resultChange];
};
export const calculateExerciseResults = (exerciseData) =>
  exerciseData.reduce((prevExercises, userExercises) => {
    const { ...rest } = Object.keys(userExercises).reduce((prevUserExercises, currentExercise) => {
      const attempts = userExercises[currentExercise];
      const { userId, exercise } = attempts[0];
      const exerciseCount = attempts.length;
      const exerciseElapsedTime = attempts.map(({ elapsedTime }) => elapsedTime).reduce(reduceSumFunc, 0);
      const isReadingExercise =
        currentExercise === 'readingExercises' || readingExerciseNames.indexOf(currentExercise) !== -1;
      let userExerciseResults = {
        userId,
        exerciseCount,
        exerciseElapsedTime,
      };
      if (isReadingExercise) {
        const readingSpeedAttempts = attempts.filter((attempt) => attempt.wordsPerMinute !== null);
        const [initialReadingSpeed, finalReadingSpeed, readingSpeedChange] = calculateFieldResult(
          readingSpeedAttempts,
          'wordsPerMinute',
        );

        const comprehensionSpeedAttempts = attempts.filter((attempt) => attempt.comprehensionPerMinute !== null);
        const [initialComprehensionSpeed, finalComprehensionSpeed, comprehensionSpeedChange] = calculateFieldResult(
          comprehensionSpeedAttempts,
          'comprehensionPerMinute',
        );

        const comprehensionLevelAttempts = attempts.filter((attempt) => attempt.comprehensionResult !== null);
        const [initialComprehensionLevel, finalComprehensionLevel, comprehensionLevelChange] = calculateFieldResult(
          comprehensionLevelAttempts,
          'comprehensionResult',
        );

        userExerciseResults = {
          ...userExerciseResults,
          exercise,
          initialReadingSpeed,
          finalReadingSpeed,
          readingSpeedChange,
          initialComprehensionSpeed,
          finalComprehensionSpeed,
          comprehensionSpeedChange,
          initialComprehensionLevel,
          finalComprehensionLevel,
          comprehensionLevelChange,
        };
      } else if (exercise === 'schulteTables') {
        const exerciseSpeedAttempts = attempts.filter((attempt) => attempt.symbolsPerMinute !== null);
        const [initialExerciseSpeed, finalExerciseSpeed, exerciseSpeedChange] = calculateFieldResult(
          exerciseSpeedAttempts,
          'symbolsPerMinute',
        );
        userExerciseResults = {
          ...userExerciseResults,
          exercise,
          initialExerciseSpeed,
          finalExerciseSpeed,
          exerciseSpeedChange,
        };
      } else if (exercise === 'concentration') {
        const exerciseResultAttempts = attempts.filter((attempt) => attempt.exerciseResult !== null);
        const [initialExerciseResult, finalExerciseResult, exerciseResultChange] = calculateFieldResult(
          exerciseResultAttempts,
          'exerciseResult',
        );

        const symbolGroupSpeedAttempts = attempts.filter((attempt) => attempt.msPerSymbolGroup !== null);
        const [initialSymbolGroupSpeed, finalSymbolGroupSpeed, symbolGroupSpeedChange] = calculateFieldResult(
          symbolGroupSpeedAttempts,
          'msPerSymbolGroup',
        );

        const symbolSpeedAttempts = attempts.filter((attempt) => attempt.msPerSymbol !== null);
        const [initialSymbolSpeed, finalSymbolSpeed, symbolSpeedChange] = calculateFieldResult(
          symbolSpeedAttempts,
          'msPerSymbol',
        );

        userExerciseResults = {
          ...userExerciseResults,
          exercise,
          initialExerciseResult,
          finalExerciseResult,
          exerciseResultChange,
          initialSymbolGroupSpeed,
          finalSymbolGroupSpeed,
          symbolGroupSpeedChange,
          initialSymbolSpeed,
          finalSymbolSpeed,
          symbolSpeedChange,
        };
      }

      return {
        ...prevUserExercises,
        [currentExercise]: prevExercises[currentExercise]
          ? prevExercises[currentExercise].concat(userExerciseResults)
          : [userExerciseResults],
      };
    }, {});
    return {
      ...prevExercises,
      ...rest,
    };
  }, {});

export const calculateReadingExerciseResults = (exerciseData) => {
  return calculateExerciseResults(exerciseData);
};

export const aggregateExerciseResults = (results, userCount) =>
  Object.keys(results).reduce((prevExercisesResults, currentExercise) => {
    const exerciseResults = results[currentExercise];
    if (exerciseResults.length === 0) {
      return prevExercisesResults;
    }
    const { exercise } = exerciseResults[0];
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
      const averageReadingSpeedChangePercentage = getChangePercentage(
        averageInitialReadingSpeed,
        averageFinalReadingSpeed,
      );

      const averageInitialComprehensionSpeed = getAverage(
        exerciseResults.map(({ initialComprehensionSpeed }) => initialComprehensionSpeed),
      );
      const averageFinalComprehensionSpeed = getAverage(
        exerciseResults.map(({ finalComprehensionSpeed }) => finalComprehensionSpeed),
      );
      const averageComprehensionSpeedChangePercentage = getChangePercentage(
        averageInitialComprehensionSpeed,
        averageFinalComprehensionSpeed,
      );

      const averageInitialComprehensionLevel = getAverage(
        exerciseResults.map(({ initialComprehensionLevel }) => initialComprehensionLevel),
      );
      const averageFinalComprehensionLevel = getAverage(
        exerciseResults.map(({ finalComprehensionLevel }) => finalComprehensionLevel),
      );
      const averageComprehensionLevelChangePercentage = getChangePercentage(
        averageInitialComprehensionLevel,
        averageFinalComprehensionLevel,
      );
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
    } else if (exercise === 'schulteTables') {
      const averageInitialExerciseSpeed = getAverage(
        exerciseResults.map(({ initialExerciseSpeed }) => initialExerciseSpeed),
      );
      const averageFinalExerciseSpeed = getAverage(exerciseResults.map(({ finalExerciseSpeed }) => finalExerciseSpeed));
      const averageExerciseSpeedChangePercentage = getChangePercentage(
        averageInitialExerciseSpeed,
        averageFinalExerciseSpeed,
      );
      aggregatedResult = {
        ...aggregatedResult,
        averageInitialExerciseSpeed,
        averageFinalExerciseSpeed,
        averageExerciseSpeedChangePercentage,
      };
    } else if (exercise === 'concentration') {
      const averageInitialExerciseResult = getAverage(
        exerciseResults.map(({ initialExerciseResult }) => initialExerciseResult),
      );
      const averageFinalExerciseResult = getAverage(
        exerciseResults.map(({ finalExerciseResult }) => finalExerciseResult),
      );
      const averageExerciseResultChangePercentage = getChangePercentage(
        averageInitialExerciseResult,
        averageFinalExerciseResult,
      );

      const averageInitialSymbolGroupSpeed = getAverage(
        exerciseResults.map(({ initialSymbolGroupSpeed }) => initialSymbolGroupSpeed),
      );
      const averageFinalSymbolGroupSpeed = getAverage(
        exerciseResults.map(({ finalSymbolGroupSpeed }) => finalSymbolGroupSpeed),
      );
      const averageSymbolGroupSpeedChangePercentage = getChangePercentage(
        averageInitialSymbolGroupSpeed,
        averageFinalSymbolGroupSpeed,
      );

      const averageInitialSymbolSpeed = getAverage(exerciseResults.map(({ initialSymbolSpeed }) => initialSymbolSpeed));
      const averageFinalSymbolSpeed = getAverage(exerciseResults.map(({ finalSymbolSpeed }) => finalSymbolSpeed));
      const averageSymbolSpeedChangePercentage = getChangePercentage(
        averageInitialSymbolSpeed,
        averageFinalSymbolSpeed,
      );
      aggregatedResult = {
        ...aggregatedResult,
        averageInitialExerciseResult,
        averageFinalExerciseResult,
        averageExerciseResultChangePercentage,
        averageInitialSymbolGroupSpeed,
        averageFinalSymbolGroupSpeed,
        averageSymbolGroupSpeedChangePercentage,
        averageInitialSymbolSpeed,
        averageFinalSymbolSpeed,
        averageSymbolSpeedChangePercentage,
      };
    }

    return {
      ...prevExercisesResults,
      [currentExercise]: aggregatedResult,
    };
  }, {});

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
