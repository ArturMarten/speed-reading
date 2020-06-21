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

const exercise = 'concentration';
const modificationNames = ['concentration-numbers-only', 'concentration-letters-only', 'concentration-mixed'];

function ConcentrationGroupTable(props) {
  const { concentrationExerciseData, translate } = props;

  const userCount = getUserCount(concentrationExerciseData);

  const groupedExerciseData = groupDataByExercise(concentrationExerciseData);
  const groupedModificationData = groupDataByModification(concentrationExerciseData);

  const exerciseResults = calculateExerciseResults(groupedExerciseData);
  const modificationResults = calculateExerciseResults(groupedModificationData);

  const aggregatedExerciseResults = aggregateExerciseResults(exerciseResults, userCount);
  const aggregatedModificationResults = aggregateExerciseResults(modificationResults, userCount);

  return (
    <>
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
            <Table.HeaderCell>{translate('group-statistics-table.average-initial-exercise-result')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-exercise-result')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-exercise-result-change-percentage')}
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
            const averageInitialExerciseResult = aggregatedResults[name]
              ? aggregatedResults[name].averageInitialExerciseResult
              : 0;
            const averageFinalExerciseResult = aggregatedResults[name]
              ? aggregatedResults[name].averageFinalExerciseResult
              : 0;
            const averageExerciseResultChangePercentage = aggregatedResults[name]
              ? aggregatedResults[name].averageExerciseResultChangePercentage
              : 0;
            return (
              <Table.Row key={name}>
                <Table.Cell>{translate('statistics.concentration')}</Table.Cell>
                <Table.Cell>{name !== exercise ? translate(`modification.${name}`) : ''}</Table.Cell>
                <Table.Cell warning={totalModificationCount === 0}>{totalModificationCount.toFixed(0)}</Table.Cell>
                <Table.Cell warning={totalModificationElapsedTime === 0}>
                  {formatMillisecondsInHours(totalModificationElapsedTime)}
                </Table.Cell>
                <Table.Cell warning={averageModificationCount === 0}>{averageModificationCount.toFixed(2)}</Table.Cell>
                <Table.Cell warning={averageInitialExerciseResult === 0}>
                  {averageInitialExerciseResult.toFixed(0)}%
                </Table.Cell>
                <Table.Cell warning={averageFinalExerciseResult === 0}>
                  {averageFinalExerciseResult.toFixed(0)}%
                </Table.Cell>
                <Table.Cell
                  negative={averageExerciseResultChangePercentage < 0}
                  warning={averageExerciseResultChangePercentage === 0}
                  positive={averageExerciseResultChangePercentage > 0}
                >
                  {`${
                    averageExerciseResultChangePercentage > 0 ? '+' : ''
                  }${averageExerciseResultChangePercentage.toFixed(2)}%`}
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
            <Table.HeaderCell>{translate('group-statistics-table.modification')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-initial-symbol-group-speed')}
            </Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-symbol-group-speed')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-symbol-group-speed-change-percentage')}
            </Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-initial-symbol-speed')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('group-statistics-table.average-final-symbol-speed')}</Table.HeaderCell>
            <Table.HeaderCell>
              {translate('group-statistics-table.average-symbol-speed-change-percentage')}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[exercise, ...modificationNames].map((name) => {
            const aggregatedResults = name === exercise ? aggregatedExerciseResults : aggregatedModificationResults;

            const averageInitialSymbolGroupSpeed = aggregatedResults[name]
              ? aggregatedResults[name].averageInitialSymbolGroupSpeed
              : 0;
            const averageFinalSymbolGroupSpeed = aggregatedResults[name]
              ? aggregatedResults[name].averageFinalSymbolGroupSpeed
              : 0;
            const averageSymbolGroupSpeedChangePercentage = aggregatedResults[name]
              ? aggregatedResults[name].averageSymbolGroupSpeedChangePercentage
              : 0;
            const averageInitialSymbolSpeed = aggregatedResults[name]
              ? aggregatedResults[name].averageInitialSymbolSpeed
              : 0;
            const averageFinalSymbolSpeed = aggregatedResults[name]
              ? aggregatedResults[name].averageFinalSymbolSpeed
              : 0;
            const averageSymbolSpeedChangePercentage = aggregatedResults[name]
              ? aggregatedResults[name].averageSymbolSpeedChangePercentage
              : 0;
            return (
              <Table.Row key={name}>
                <Table.Cell>{translate(`statistics.${exercise}`)}</Table.Cell>
                <Table.Cell>{name !== exercise ? translate(`modification.${name}`) : ''}</Table.Cell>
                <Table.Cell warning={averageInitialSymbolGroupSpeed === 0}>
                  {averageInitialSymbolGroupSpeed.toFixed(0)}&nbsp;ms
                </Table.Cell>
                <Table.Cell warning={averageFinalSymbolGroupSpeed === 0}>
                  {averageFinalSymbolGroupSpeed.toFixed(0)}&nbsp;ms
                </Table.Cell>
                <Table.Cell
                  negative={averageSymbolGroupSpeedChangePercentage > 0}
                  warning={averageSymbolGroupSpeedChangePercentage === 0}
                  positive={averageSymbolGroupSpeedChangePercentage < 0}
                >
                  {`${
                    averageSymbolGroupSpeedChangePercentage > 0 ? '+' : ''
                  }${averageSymbolGroupSpeedChangePercentage.toFixed(2)}%`}
                </Table.Cell>
                <Table.Cell warning={averageInitialSymbolSpeed === 0}>
                  {averageInitialSymbolSpeed.toFixed(0)}&nbsp;ms
                </Table.Cell>
                <Table.Cell warning={averageFinalSymbolSpeed === 0}>
                  {averageFinalSymbolSpeed.toFixed(0)}&nbsp;ms
                </Table.Cell>
                <Table.Cell
                  negative={averageSymbolSpeedChangePercentage > 0}
                  warning={averageSymbolSpeedChangePercentage === 0}
                  positive={averageSymbolSpeedChangePercentage < 0}
                >
                  {`${averageSymbolSpeedChangePercentage > 0 ? '+' : ''}${averageSymbolSpeedChangePercentage.toFixed(
                    2,
                  )}%`}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}

export default ConcentrationGroupTable;
