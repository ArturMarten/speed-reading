import React from 'react';
import {
  filterByAttemptCount,
  filterReadingExercises,
  filterOwnTextAttempts,
  filterFirstReadingAttempts,
  filterByExerciseName,
} from './util/groupTable';
import {
  lowerBoundOutlierFilter,
  upperBoundOutlierFilter,
  filterStandardDeviation,
} from '../../../containers/Statistics/util/statistics';
import ConcentrationGroupTable from './ConcentrationGroupTable';
import SchulteGroupTable from './SchulteGroupTable';
import ReadingGroupTable from './ReadingGroupTable';
import VisualVocabularyGroupTable from './VisualVocabularyGroupTable';

function GroupTable(props) {
  const {
    data,
    isTeacher,
    minimumAttemptCount,
    minimumAttemptCountChangeHandler,
    filterOwnTexts = false,
    filterFirstReadingAttempt = false,
    groupName,
    timeFilter,
    translate,
  } = props;

  const filteredGroupData = Object.assign(
    {},
    ...Object.keys(data).map((userId) => {
      const boundFiltered = data[userId]
        .filter((attempt) => upperBoundOutlierFilter(attempt))
        .filter((attempt) => lowerBoundOutlierFilter(attempt));
      const standardDeviationFiltered = [
        ...filterStandardDeviation('readingExercises', boundFiltered),
        ...filterStandardDeviation('schulteTables', boundFiltered),
        ...filterStandardDeviation('concentration', boundFiltered),
        ...filterStandardDeviation('visualVocabulary', boundFiltered),
      ];
      const filteredData = standardDeviationFiltered.filter(timeFilter);
      return {
        [userId]: filteredData,
      };
    }),
  );

  let readingExerciseData = filterReadingExercises(filteredGroupData);
  readingExerciseData = filterOwnTextAttempts(readingExerciseData, filterOwnTexts);
  readingExerciseData = filterFirstReadingAttempts(readingExerciseData, filterFirstReadingAttempt);
  let schulteTablesExerciseData = filterByExerciseName(filteredGroupData, 'schulteTables');
  let concentrationExerciseData = filterByExerciseName(filteredGroupData, 'concentration');
  let visualVocabularyExerciseData = filterByExerciseName(filteredGroupData, 'visualVocabulary');

  if (isTeacher) {
    readingExerciseData = filterByAttemptCount(readingExerciseData, minimumAttemptCount);
    schulteTablesExerciseData = filterByAttemptCount(schulteTablesExerciseData, minimumAttemptCount);
    concentrationExerciseData = filterByAttemptCount(concentrationExerciseData, minimumAttemptCount);
    visualVocabularyExerciseData = filterByAttemptCount(visualVocabularyExerciseData, minimumAttemptCount);
  }

  return (
    <>
      <ReadingGroupTable
        readingExerciseData={readingExerciseData}
        minimumAttemptCount={minimumAttemptCount}
        minimumAttemptCountChangeHandler={minimumAttemptCountChangeHandler}
        groupName={groupName}
        isTeacher={isTeacher}
        translate={translate}
      />
      <SchulteGroupTable
        schulteTablesExerciseData={schulteTablesExerciseData}
        minimumAttemptCount={minimumAttemptCount}
        minimumAttemptCountChangeHandler={minimumAttemptCountChangeHandler}
        groupName={groupName}
        translate={translate}
      />
      <ConcentrationGroupTable
        concentrationExerciseData={concentrationExerciseData}
        minimumAttemptCount={minimumAttemptCount}
        minimumAttemptCountChangeHandler={minimumAttemptCountChangeHandler}
        groupName={groupName}
        translate={translate}
      />
      <VisualVocabularyGroupTable
        visualVocabularyExerciseData={visualVocabularyExerciseData}
        minimumAttemptCount={minimumAttemptCount}
        minimumAttemptCountChangeHandler={minimumAttemptCountChangeHandler}
        groupName={groupName}
        translate={translate}
      />
    </>
  );
}

export default GroupTable;
