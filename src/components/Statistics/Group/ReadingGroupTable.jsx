import React from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import { formatMillisecondsInHours, downloadExcelData } from '../../../shared/utility';
import {
  getUserCount,
  calculateExerciseResults,
  aggregateExerciseResults,
  groupDataByExercise,
  readingExerciseNames,
  exerciseTranslateMapping,
  prepareResults,
} from './util/groupTable';
import { exportFile } from '../../../api';

function exportData(results, translate) {
  const { filename, filetype, ...rest } = prepareResults(results, translate);
  exportFile({ filename, filetype, ...rest }).then((data) => {
    downloadExcelData(data, filename, filetype);
  });
}

function ReadingGroupTable(props) {
  const { readingExerciseData, isTeacher, translate } = props;

  const userCount = getUserCount(readingExerciseData);

  const groupedExerciseData = groupDataByExercise(readingExerciseData);

  const exerciseResults = calculateExerciseResults(groupedExerciseData);

  const aggregatedExerciseResults = aggregateExerciseResults(exerciseResults, userCount);

  return (
    <>
      <Table basic celled selectable textAlign="center" compact fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{translate('group-statistics-table.exercise')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.total-exercise-count')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.total-exercise-elapsed-time')}</Table.HeaderCell>
            <Table.HeaderCell>
              {`${translate('group-statistics-table.average-exercise-count-per-user', {
                userCount,
              })}`}
            </Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-initial-reading-speed')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-reading-speed')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-reading-speed-change-percentage')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {readingExerciseNames.map((exercise) => {
            const totalExerciseCount = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].totalExerciseCount
              : 0;
            const totalExerciseElapsedTime = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].totalExerciseElapsedTime
              : 0;
            const averageExerciseCount = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageExerciseCount
              : 0;
            const averageInitialReadingSpeed = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageInitialReadingSpeed
              : 0;
            const averageFinalReadingSpeed = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageFinalReadingSpeed
              : 0;
            const averageReadingSpeedChangePercentage = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageReadingSpeedChangePercentage
              : 0;
            return (
              <Table.Row key={exercise}>
                <Table.Cell>{translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
                <Table.Cell warning={totalExerciseCount === 0}>{totalExerciseCount.toFixed(0)}</Table.Cell>
                <Table.Cell warning={totalExerciseElapsedTime === 0}>
                  {formatMillisecondsInHours(totalExerciseElapsedTime)}
                </Table.Cell>
                <Table.Cell warning={averageExerciseCount === 0}>{averageExerciseCount.toFixed(2)}</Table.Cell>
                <Table.Cell warning={averageInitialReadingSpeed === 0}>
                  {averageInitialReadingSpeed.toFixed(0)}
                </Table.Cell>
                <Table.Cell warning={averageFinalReadingSpeed === 0}>{averageFinalReadingSpeed.toFixed(0)}</Table.Cell>
                <Table.Cell
                  negative={averageReadingSpeedChangePercentage < 0}
                  warning={averageReadingSpeedChangePercentage === 0}
                  positive={averageReadingSpeedChangePercentage > 0}
                >
                  {`${averageReadingSpeedChangePercentage > 0 ? '+' : ''}${averageReadingSpeedChangePercentage.toFixed(
                    2,
                  )}%`}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Table basic celled selectable textAlign="center" compact fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{translate('group-statistics-table.exercise')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-initial-comprehension-speed')}
            </Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-comprehension-speed')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-comprehension-speed-change-percentage')}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-initial-comprehension-level')}
            </Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-comprehension-level')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-comprehension-level-change-percentage')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {readingExerciseNames.map((exercise) => {
            const averageInitialComprehensionSpeed = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageInitialComprehensionSpeed
              : 0;
            const averageFinalComprehensionSpeed = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageFinalComprehensionSpeed
              : 0;
            const averageComprehensionSpeedChangePercentage = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageComprehensionSpeedChangePercentage
              : 0;
            const averageInitialComprehensionLevel = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageInitialComprehensionLevel
              : 0;
            const averageFinalComprehensionLevel = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageFinalComprehensionLevel
              : 0;
            const averageComprehensionLevelChangePercentage = aggregatedExerciseResults[exercise]
              ? aggregatedExerciseResults[exercise].averageComprehensionLevelChangePercentage
              : 0;
            return (
              <Table.Row key={exercise}>
                <Table.Cell>{translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
                <Table.Cell warning={averageInitialComprehensionSpeed === 0}>
                  {averageInitialComprehensionSpeed.toFixed(0)}
                </Table.Cell>
                <Table.Cell warning={averageFinalComprehensionSpeed === 0}>
                  {averageFinalComprehensionSpeed.toFixed(0)}
                </Table.Cell>
                <Table.Cell
                  negative={averageComprehensionSpeedChangePercentage < 0}
                  warning={averageComprehensionSpeedChangePercentage === 0}
                  positive={averageComprehensionSpeedChangePercentage > 0}
                >
                  {`${
                    averageComprehensionSpeedChangePercentage > 0 ? '+' : ''
                  }${averageComprehensionSpeedChangePercentage.toFixed(2)}%`}
                </Table.Cell>
                <Table.Cell warning={averageInitialComprehensionLevel === 0}>
                  {averageInitialComprehensionLevel.toFixed(0)}%
                </Table.Cell>
                <Table.Cell warning={averageFinalComprehensionLevel === 0}>
                  {averageFinalComprehensionLevel.toFixed(0)}%
                </Table.Cell>
                <Table.Cell
                  negative={averageComprehensionLevelChangePercentage < 0}
                  warning={averageComprehensionLevelChangePercentage === 0}
                  positive={averageComprehensionLevelChangePercentage > 0}
                >
                  {`${
                    averageComprehensionLevelChangePercentage > 0 ? '+' : ''
                  }${averageComprehensionLevelChangePercentage.toFixed(2)}%`}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      {isTeacher ? (
        <Button
          icon
          basic
          floated="right"
          size="large"
          color="blue"
          disabled={Object.keys(exerciseResults).length <= 1}
          onClick={() => exportData(exerciseResults, translate)}
          style={{ marginBottom: '1em' }}
        >
          {`${translate('statistics-table.export')}`}
          &nbsp;
          <Icon name="download" />
        </Button>
      ) : null}
    </>
  );
}

export default ReadingGroupTable;
