import React, { Component } from 'react';
import { filterByAttemptCount, filterReadingExercises, filterByExerciseName } from './util/groupTable';
import {
  lowerBoundOutlierFilter,
  upperBoundOutlierFilter,
  filterStandardDeviation,
} from '../../../containers/Statistics/util/statistics';
import ConcentrationGroupTable from './ConcentrationGroupTable';
import SchulteGroupTable from './SchulteGroupTable';
import ReadingGroupTable from './ReadingGroupTable';

export class GroupTable extends Component {
  render() {
    const { data, isTeacher, minimumAttemptCount, timeFilter, translate } = this.props;
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
    let concentrationExerciseData = filterByExerciseName(filteredGroupData, 'concentration');
    let schulteTablesExerciseData = filterByExerciseName(filteredGroupData, 'schulteTables');

    if (isTeacher) {
      readingExerciseData = filterByAttemptCount(readingExerciseData, minimumAttemptCount);
      concentrationExerciseData = filterByAttemptCount(concentrationExerciseData, minimumAttemptCount);
      schulteTablesExerciseData = filterByAttemptCount(schulteTablesExerciseData, minimumAttemptCount);
    }

    return (
      <>
        <ReadingGroupTable readingExerciseData={readingExerciseData} isTeacher={isTeacher} translate={translate} />
        <SchulteGroupTable schulteTablesExerciseData={schulteTablesExerciseData} translate={translate} />
        <ConcentrationGroupTable concentrationExerciseData={concentrationExerciseData} translate={translate} />
      </>
    );
  }
}

export default GroupTable;
