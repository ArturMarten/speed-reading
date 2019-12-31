import React, { Component, Fragment } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';

import { exportFile } from '../../api';
import { formatMillisecondsInHours, downloadExcelData } from '../../shared/utility';
import {
  readingExerciseNames,
  helpExerciseNames,
  filterReadingExercises,
  filterHelpExercises,
  filterByAttemptCount,
  getUserCount,
  groupDataByExercise,
  calculateReadingExerciseResults,
  calculateHelpExerciseResults,
  aggregateReadingExerciseResults,
  aggregateHelpExerciseResults,
  exerciseTranslateMapping,
  prepareResults,
} from './util/groupTable';

export class GroupTable extends Component {
  state = {};

  exportData = (results, translate) => {
    const { filename, filetype, ...rest } = prepareResults(results, translate);
    exportFile({ filename, filetype, ...rest }).then((data) => {
      downloadExcelData(data, filename, filetype);
    });
  };

  render() {
    let { data } = this.props;
    const { isTeacher, minimumAttemptCount } = this.props;
    let readingExerciseData = filterReadingExercises(data);
    let helpExerciseData = filterHelpExercises(data);

    if (isTeacher) {
      readingExerciseData = filterByAttemptCount(readingExerciseData, minimumAttemptCount);
      helpExerciseData = filterByAttemptCount(helpExerciseData, minimumAttemptCount);
      data = filterByAttemptCount(data, minimumAttemptCount);
    }
    // const userCount = getUserCount(data);
    const readingExerciseUserCount = getUserCount(readingExerciseData);
    const helpExerciseUserCount = getUserCount(helpExerciseData);

    // const exerciseData = groupDataByExercise(data);
    const groupedReadingExerciseData = groupDataByExercise(readingExerciseData);
    const groupedHelpExerciseData = groupDataByExercise(helpExerciseData);

    // const exerciseResults = calculateExerciseResults(exerciseData);
    const readingExerciseResults = calculateReadingExerciseResults(groupedReadingExerciseData);
    const helpExerciseResults = calculateHelpExerciseResults(groupedHelpExerciseData);

    // const aggregatedResults = aggerateExerciseResults(exerciseResults, userCount);
    const aggregatedReadingExerciseResults = aggregateReadingExerciseResults(
      readingExerciseResults,
      readingExerciseUserCount,
    );
    const aggregatedHelpExerciseResults = aggregateHelpExerciseResults(helpExerciseResults, helpExerciseUserCount);

    return (
      <Fragment>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.exercise')}</Table.HeaderCell>
              <Table.HeaderCell>{this.props.translate('group-statistics-table.total-exercise-count')}</Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-elapsed-time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {`${this.props.translate(
                  'group-statistics-table.average-exercise-count-per-user',
                )} (${readingExerciseUserCount})`}
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
                {`${this.props.translate(
                  'group-statistics-table.average-exercise-count-per-user',
                )} (${helpExerciseUserCount})`}
              </Table.HeaderCell>
              {/*
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-initial-exercise-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-final-exercise-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-exercise-speed-change-percentage')}
              </Table.HeaderCell>
              */}
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
              /*
              const averageInitialExerciseSpeed = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].averageInitialExerciseSpeed
                : 0;
              const averageFinalExerciseSpeed = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].averageFinalExerciseSpeed
                : 0;
              const averageExerciseSpeedChangePercentage = aggregatedHelpExerciseResults[exercise]
                ? aggregatedHelpExerciseResults[exercise].averageExerciseSpeedChangePercentage
                : 0;
              */
              return (
                <Table.Row key={exercise}>
                  <Table.Cell>{this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}</Table.Cell>
                  <Table.Cell warning={totalExerciseCount === 0}>{totalExerciseCount.toFixed(0)}</Table.Cell>
                  <Table.Cell warning={totalExerciseElapsedTime === 0}>
                    {formatMillisecondsInHours(totalExerciseElapsedTime)}
                  </Table.Cell>
                  <Table.Cell warning={averageExerciseCount === 0}>{averageExerciseCount.toFixed(2)}</Table.Cell>
                  {/*
                  <Table.Cell warning={averageInitialExerciseSpeed === 0}>
                    {averageInitialExerciseSpeed.toFixed(0)}
                  </Table.Cell>
                  <Table.Cell warning={averageFinalExerciseSpeed === 0}>
                    {averageFinalExerciseSpeed.toFixed(0)}
                  </Table.Cell>
                  <Table.Cell
                    negative={averageExerciseSpeedChangePercentage < 0}
                    warning={averageExerciseSpeedChangePercentage === 0}
                    positive={averageExerciseSpeedChangePercentage > 0}
                  >
                    {`${
                      averageExerciseSpeedChangePercentage > 0 ? '+' : ''
                    }${averageExerciseSpeedChangePercentage.toFixed(2)}%`}
                  </Table.Cell>
                   */}
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
      </Fragment>
    );
  }
}

export default GroupTable;
