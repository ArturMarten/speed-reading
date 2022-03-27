import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';
import { formatMillisecondsInHours } from '../../../shared/utility';
import DistributionChart from './DistributionChart';
import {
  getUserCount,
  calculateExerciseResults,
  aggregateExerciseResults,
  groupDataByExercise,
  groupDataByModification,
} from './util/groupTable';

const exercise = 'visualVocabulary';
const modificationNames = [];

function getSelectedData(exerciseData, modificationData, { exercise, modification, field }, userCount) {
  if (!exercise || !modification || !field) return null;
  let selectedData = [];
  if (exercise !== modification) {
    if (!modificationData[modification]) return selectedData;
    selectedData = modificationData[modification].map((user) => ({
      userId: user.userId,
      value: user[field],
    }));
    if (field === 'exerciseCount') {
      const zeros = [...Array(userCount - selectedData.length)].map(() => ({ value: 0 }));
      selectedData = [...selectedData, ...zeros];
    }
    return selectedData;
  } else {
    if (!exerciseData[exercise]) return selectedData;
    selectedData = exerciseData[exercise].map((user) => ({
      userId: user.userId,
      value: user[field],
    }));
  }
  return selectedData;
}

function VisualVocabularyGroupTable(props) {
  const { visualVocabularyExerciseData, minimumAttemptCount, minimumAttemptCountChangeHandler, groupName, translate } =
    props;
  const [selection, setSelection] = useState({ exercise: null, modification: null, field: null });

  const userCount = getUserCount(visualVocabularyExerciseData);

  const groupedExerciseData = groupDataByExercise(visualVocabularyExerciseData);
  const groupedModificationData = groupDataByModification(visualVocabularyExerciseData);

  const exerciseResults = calculateExerciseResults(groupedExerciseData);
  const modificationResults = calculateExerciseResults(groupedModificationData);

  const selectedData = getSelectedData(exerciseResults, modificationResults, selection, userCount);

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
                <Table.Cell>{translate('statistics.visual-vocabulary')}</Table.Cell>
                <Table.Cell>{name !== exercise ? translate(`modification.${name}`) : ''}</Table.Cell>
                <Table.Cell warning={totalModificationCount === 0}>{totalModificationCount.toFixed(0)}</Table.Cell>
                <Table.Cell warning={totalModificationElapsedTime === 0}>
                  {formatMillisecondsInHours(totalModificationElapsedTime)}
                </Table.Cell>
                <Table.Cell
                  warning={averageModificationCount === 0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelection({ exercise, modification: name, field: 'exerciseCount' })}
                >
                  {averageModificationCount.toFixed(2)}
                </Table.Cell>
                <Table.Cell
                  warning={averageInitialExerciseResult === 0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelection({ exercise, modification: name, field: 'initialExerciseResult' })}
                >
                  {averageInitialExerciseResult.toFixed(0)}%
                </Table.Cell>
                <Table.Cell
                  warning={averageFinalExerciseResult === 0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelection({ exercise, modification: name, field: 'finalExerciseResult' })}
                >
                  {averageFinalExerciseResult.toFixed(0)}%
                </Table.Cell>
                <Table.Cell
                  negative={averageExerciseResultChangePercentage < 0}
                  warning={averageExerciseResultChangePercentage === 0}
                  positive={averageExerciseResultChangePercentage > 0}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelection({ exercise, modification: name, field: 'exerciseResultChange' })}
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
      {selectedData ? (
        <DistributionChart
          data={selectedData}
          exercise={selection.exercise}
          modification={selection.exercise !== selection.modification ? selection.modification : null}
          groupName={groupName}
          userCount={userCount}
          field={selection.field}
          minimumAttemptCount={minimumAttemptCount}
          minimumAttemptCountChangeHandler={minimumAttemptCountChangeHandler}
          onClose={() => setSelection({ exercise: null, field: null })}
          translate={translate}
        />
      ) : null}
    </>
  );
}

export default VisualVocabularyGroupTable;
