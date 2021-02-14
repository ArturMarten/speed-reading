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
  let concentrationExerciseData = filterByExerciseName(filteredGroupData, 'concentration');
  let schulteTablesExerciseData = filterByExerciseName(filteredGroupData, 'schulteTables');

  if (isTeacher) {
    readingExerciseData = filterByAttemptCount(readingExerciseData, minimumAttemptCount);
    concentrationExerciseData = filterByAttemptCount(concentrationExerciseData, minimumAttemptCount);
    schulteTablesExerciseData = filterByAttemptCount(schulteTablesExerciseData, minimumAttemptCount);
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
    </>
  );
}

export default GroupTable;
