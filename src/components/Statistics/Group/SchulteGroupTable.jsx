import React from 'react';
import { Table } from 'semantic-ui-react';
import { formatMillisecondsInHours } from '../../../shared/utility';
import {
  getUserCount,
  calculateExerciseResults,
  aggregateExerciseResults,
  groupDataByExercise,
  groupDataByModification,
} from './util/groupTable';

const exercise = 'schulteTables';
const modificationNames = ['numbers', 'letters-lowercase', 'letters-uppercase', 'letters-mixed'];

function SchulteGroupTable(props) {
  const { schulteTablesExerciseData, translate } = props;

  const userCount = getUserCount(schulteTablesExerciseData);

  const groupedExerciseData = groupDataByExercise(schulteTablesExerciseData);
  const groupedModificationData = groupDataByModification(schulteTablesExerciseData);

  const exerciseResults = calculateExerciseResults(groupedExerciseData);
  const modificationResults = calculateExerciseResults(groupedModificationData);

  const aggregatedExerciseResults = aggregateExerciseResults(exerciseResults, userCount);
  const aggregatedModificationResults = aggregateExerciseResults(modificationResults, userCount);

  return (
    <Table basic celled selectable textAlign="center" compact fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{translate('group-statistics-table.exercise')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('group-statistics-table.modification')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('group-statistics-table.total-exercise-count')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('group-statistics-table.total-exercise-elapsed-time')}</Table.HeaderCell>
          <Table.HeaderCell>
            {`${translate('group-statistics-table.average-exercise-count-per-user', {
              userCount,
            })}`}
          </Table.HeaderCell>
          <Table.HeaderCell>{translate('group-statistics-table.average-initial-exercise-speed')}</Table.HeaderCell>
          <Table.HeaderCell>{translate('group-statistics-table.average-final-exercise-speed')}</Table.HeaderCell>
          <Table.HeaderCell>
            {translate('group-statistics-table.average-exercise-speed-change-percentage')}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[exercise, ...modificationNames].map((name) => {
          const aggregatedResults = name === exercise ? aggregatedExerciseResults : aggregatedModificationResults;
          const totalModificationCount = aggregatedResults[name] ? aggregatedResults[name].totalExerciseCount : 0;
          const totalModificationElapsedTime = aggregatedResults[name]
            ? aggregatedResults[name].totalExerciseElapsedTime
            : 0;
          const averageModificationCount = aggregatedResults[name] ? aggregatedResults[name].averageExerciseCount : 0;
          const averageInitialExerciseSpeed = aggregatedResults[name]
            ? aggregatedResults[name].averageInitialExerciseSpeed
            : 0;
          const averageFinalExerciseSpeed = aggregatedResults[name]
            ? aggregatedResults[name].averageFinalExerciseSpeed
            : 0;
          const averageExerciseSpeedChangePercentage = aggregatedResults[name]
            ? aggregatedResults[name].averageExerciseSpeedChangePercentage
            : 0;
          return (
            <Table.Row key={name}>
              <Table.Cell>{translate('statistics.schulte-tables')}</Table.Cell>
              <Table.Cell>{name !== exercise ? translate(`modification.${name}`) : ''}</Table.Cell>
              <Table.Cell warning={totalModificationCount === 0}>{totalModificationCount.toFixed(0)}</Table.Cell>
              <Table.Cell warning={totalModificationElapsedTime === 0}>
                {formatMillisecondsInHours(totalModificationElapsedTime)}
              </Table.Cell>
              <Table.Cell warning={averageModificationCount === 0}>{averageModificationCount.toFixed(2)}</Table.Cell>
              <Table.Cell warning={averageInitialExerciseSpeed === 0}>
                {averageInitialExerciseSpeed.toFixed(0)}
              </Table.Cell>
              <Table.Cell warning={averageFinalExerciseSpeed === 0}>{averageFinalExerciseSpeed.toFixed(0)}</Table.Cell>
              <Table.Cell
                negative={averageExerciseSpeedChangePercentage < 0}
                warning={averageExerciseSpeedChangePercentage === 0}
                positive={averageExerciseSpeedChangePercentage > 0}
              >
                {`${averageExerciseSpeedChangePercentage > 0 ? '+' : ''}${averageExerciseSpeedChangePercentage.toFixed(
                  2,
                )}%`}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default SchulteGroupTable;
