import React, { Component } from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import { exportFile } from '../../api';
import { downloadExcelData, formatMillisecondsInHours } from '../../shared/utility';
import {
  aggregateHelpExerciseResults,
  aggregateReadingExerciseResults,
  calculateHelpExerciseResults,
  calculateReadingExerciseResults,
  exerciseTranslateMapping,
  filterByAttemptCount,
  filterHelpExercises,
  filterReadingExercises,
  getUserCount,
  groupDataByExercise,
  helpExerciseNames,
  prepareResults,
  readingExerciseNames,
} from './util/groupTable';
import {
  lowerBoundOutlierFilter,
  upperBoundOutlierFilter,
  filterStandardDeviation,
} from '../../containers/Statistics/util/statistics';

export class GroupTable extends Component {
  exportData = (results, translate) => {
    const { filename, filetype, ...rest } = prepareResults(results, translate);
    exportFile({ filename, filetype, ...rest }).then((data) => {
      downloadExcelData(data, filename, filetype);
    });
  };

  render() {
    const { data, isTeacher, minimumAttemptCount, timeFilter } = this.props;
    const filteredGroupData = Object.assign(
      {},
      ...Object.keys(data).map((userId) => {
        let filteredData = data[userId]
          .filter((attempt) => upperBoundOutlierFilter(attempt))
          .filter((attempt) => lowerBoundOutlierFilter(attempt));
        filteredData = [
          ...filterStandardDeviation('readingExercises', filteredData),
          ...filterStandardDeviation('schulteTables', filteredData),
          ...filterStandardDeviation('concentration', filteredData),
        ];
        filteredData = filteredData.filter(timeFilter);
        return {
          [userId]: filteredData,
        };
      }),
    );

    let readingExerciseData = filterReadingExercises(filteredGroupData);
    let helpExerciseData = filterHelpExercises(filteredGroupData);

    if (isTeacher) {
      readingExerciseData = filterByAttemptCount(readingExerciseData, minimumAttemptCount);
      helpExerciseData = filterByAttemptCount(helpExerciseData, minimumAttemptCount);
    }
    const readingExerciseUserCount = getUserCount(readingExerciseData);
    const helpExerciseUserCount = getUserCount(helpExerciseData);

    const groupedReadingExerciseData = groupDataByExercise(readingExerciseData);
    const groupedHelpExerciseData = groupDataByExercise(helpExerciseData);

    const readingExerciseResults = calculateReadingExerciseResults(groupedReadingExerciseData);
    const helpExerciseResults = calculateHelpExerciseResults(groupedHelpExerciseData);

    const aggregatedReadingExerciseResults = aggregateReadingExerciseResults(
      readingExerciseResults,
      readingExerciseUserCount,
    );
    const aggregatedHelpExerciseResults = aggregateHelpExerciseResults(helpExerciseResults, helpExerciseUserCount);

    return (
      <>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.exercise')}</Table.HeaderCell>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.total-exercise-count')}</Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-elapsed-time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {`${this.props.translate('group-statistics-table.average-exercise-count-per-user', {
                  userCount: readingExerciseUserCount,
                })}`}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-initial-reading-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-final-reading-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-reading-speed-change-percentage')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {readingExerciseNames.map((exercise) => {
              const totalExerciseCount = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].totalExerciseCount
                : 0;
              const totalExerciseElapsedTime = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].totalExerciseElapsedTime
                : 0;
              const averageExerciseCount = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageExerciseCount
                : 0;
              const averageInitialReadingSpeed = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageInitialReadingSpeed
                : 0;
              const averageFinalReadingSpeed = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageFinalReadingSpeed
                : 0;
              const averageReadingSpeedChangePercentage = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageReadingSpeedChangePercentage
                : 0;
              return (
                <Table.Row key={exercise}>
                  <Table.Cell>{this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
                  <Table.Cell warning={totalExerciseCount === 0}>{totalExerciseCount.toFixed(0)}</Table.Cell>
                  <Table.Cell warning={totalExerciseElapsedTime === 0}>
                    {formatMillisecondsInHours(totalExerciseElapsedTime)}
                  </Table.Cell>
                  <Table.Cell warning={averageExerciseCount === 0}>{averageExerciseCount.toFixed(2)}</Table.Cell>
                  <Table.Cell warning={averageInitialReadingSpeed === 0}>
                    {averageInitialReadingSpeed.toFixed(0)}
                  </Table.Cell>
                  <Table.Cell warning={averageFinalReadingSpeed === 0}>
                    {averageFinalReadingSpeed.toFixed(0)}
                  </Table.Cell>
                  <Table.Cell
                    negative={averageReadingSpeedChangePercentage < 0}
                    warning={averageReadingSpeedChangePercentage === 0}
                    positive={averageReadingSpeedChangePercentage > 0}
                  >
                    {`${
                      averageReadingSpeedChangePercentage > 0 ? '+' : ''
                    }${averageReadingSpeedChangePercentage.toFixed(2)}%`}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.exercise')}</Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-initial-comprehension-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-final-comprehension-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-comprehension-speed-change-percentage')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-initial-comprehension-level')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-final-comprehension-level')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-comprehension-level-change-percentage')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {readingExerciseNames.map((exercise) => {
              const averageInitialComprehensionSpeed = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageInitialComprehensionSpeed
                : 0;
              const averageFinalComprehensionSpeed = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageFinalComprehensionSpeed
                : 0;
              const averageComprehensionSpeedChangePercentage = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageComprehensionSpeedChangePercentage
                : 0;
              const averageInitialComprehensionLevel = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageInitialComprehensionLevel
                : 0;
              const averageFinalComprehensionLevel = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageFinalComprehensionLevel
                : 0;
              const averageComprehensionLevelChangePercentage = aggregatedReadingExerciseResults[exercise]
                ? aggregatedReadingExerciseResults[exercise].averageComprehensionLevelChangePercentage
                : 0;
              return (
                <Table.Row key={exercise}>
                  <Table.Cell>{this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
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
                    {averageInitialComprehensionLevel.toFixed(0)}
                  </Table.Cell>
                  <Table.Cell warning={averageFinalComprehensionLevel === 0}>
                    {averageFinalComprehensionLevel.toFixed(0)}
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
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.exercise')}</Table.HeaderCell>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.total-exercise-count')}</Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-elapsed-time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {`${this.props.translate('group-statistics-table.average-exercise-count-per-user', {
                  userCount: helpExerciseUserCount,
                })}`}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {helpExerciseNames.map((exercise) => {
              const totalExerciseCount = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].totalExerciseCount
                : 0;
              const totalExerciseElapsedTime = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].totalExerciseElapsedTime
                : 0;
              const averageExerciseCount = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].averageExerciseCount
                : 0;
              return (
                <Table.Row key={exercise}>
                  <Table.Cell>{this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
                  <Table.Cell warning={totalExerciseCount === 0}>{totalExerciseCount.toFixed(0)}</Table.Cell>
                  <Table.Cell warning={totalExerciseElapsedTime === 0}>
                    {formatMillisecondsInHours(totalExerciseElapsedTime)}
                  </Table.Cell>
                  <Table.Cell warning={averageExerciseCount === 0}>{averageExerciseCount.toFixed(2)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        {this.props.isTeacher ? (
          <Button
            icon
            basic
            floated="right"
            size="large"
            color="blue"
            disabled={Object.keys(readingExerciseResults).length <= 1}
            onClick={() => this.exportData(readingExerciseResults, this.props.translate)}
          >
            {`${this.props.translate('statistics-table.export')} `}
            <Icon name="download" />
          </Button>
        ) : null}
      </>
    );
  }
}

export default GroupTable;
