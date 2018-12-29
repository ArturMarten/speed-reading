import React, { Component, Fragment } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';

import { exportFile } from '../../api';
import { leastSquares, getAverage, reduceSumFunc, formatMillisecondsInHours, downloadExcelData } from '../../shared/utility';

const exerciseTranslateMapping = {
  readingExercises: 'reading-exercises',
  readingTest: 'reading-test',
  readingAid: 'reading-aid',
  scrolling: 'scrolling-text',
  disappearing: 'disappearing-text',
  wordGroups: 'word-groups',
  schulteTables: 'schulte-tables',
  concentration: 'concentration',
};

const readingExerciseNames = [
  'readingExercises',
  'readingTest',
  'readingAid',
  'scrolling',
  'disappearing',
  'wordGroups',
];

const helpExerciseNames = [
  'schulteTables',
  'concentration',
];

export class GroupTable extends Component {
  state = {};

  exportData = (results) => {
    const now = new Date();
    const filename = `data_${now.toLocaleDateString()}_${now.toLocaleTimeString()}`;
    const filetype = 'xlsx';
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
    const rows = Object.keys(results)
      .reduce((prevResults, exerciseName) => {
        if (readingExerciseNames.indexOf(exerciseName) === -1 || exerciseName === 'readingExercises') {
          return [...prevResults];
        }
        const currentResults = results[exerciseName]
          .map((result) => {
            const exerciseElapsedTime = formatMillisecondsInHours(result.exerciseElapsedTime);
            const initialReadingSpeed = +result.initialReadingSpeed.toFixed(0);
            const finalReadingSpeed = +result.finalReadingSpeed.toFixed(0);
            const readingSpeedChange = +(result.finalReadingSpeed - result.initialReadingSpeed).toFixed(2);
            const readingSpeedChangePercentage = +((readingSpeedChange / result.initialReadingSpeed) * 100).toFixed(2);
            const initialComprehensionSpeed = +result.initialComprehensionSpeed.toFixed(0);
            const finalComprehensionSpeed = +result.finalComprehensionSpeed.toFixed(0);
            const comprehensionSpeedChange = +(result.finalComprehensionSpeed - result.initialComprehensionSpeed).toFixed(0);
            const comprehensionSpeedChangePercentage = +((comprehensionSpeedChange / result.initialComprehensionSpeed) * 100).toFixed(2);
            const initialComprehensionLevel = +result.initialComprehensionLevel.toFixed(0);
            const finalComprehensionLevel = +result.finalComprehensionLevel.toFixed(0);
            const comprehensionLevelChange = +(result.finalComprehensionLevel - result.initialComprehensionLevel).toFixed(0);
            const comprehensionLevelChangePercentage = +((comprehensionLevelChange / result.initialComprehensionLevel) * 100).toFixed(2);
            return {
              ...result,
              exerciseName: this.props.translate(`statistics.${exerciseTranslateMapping[exerciseName]}`),
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
        return [
          ...prevResults,
          ...currentResults,
        ];
      }, []);
    const headings = {
      userId: 'Identifikaator',
      exerciseCount: this.props.translate('group-statistics-table.total-exercise-count'),
      exerciseName: this.props.translate('group-statistics-table.exercise'),
      exerciseElapsedTime: this.props.translate('group-statistics-table.total-exercise-elapsed-time'),
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

    exportFile({
      filename,
      filetype,
      columns,
      rows,
      headings,
    }).then((data) => {
      downloadExcelData(data, filename, filetype);
    });
  }

  render() {
    const { data } = this.props;
    const userCount =
      Object.keys(data)
        .filter(userId => data[userId].length > 0).length;
    const exerciseData = Object.keys(data)
      .reduce((prevUserArray, currentUserId) => (
        prevUserArray.concat(data[currentUserId]
          .reduce((prevExercisesObject, currentAttempt) => {
            if (prevExercisesObject[currentAttempt.exercise]) {
              return {
                ...prevExercisesObject,
                [currentAttempt.exercise]: prevExercisesObject[currentAttempt.exercise].concat({
                  ...currentAttempt,
                  index: prevExercisesObject[currentAttempt.exercise].length + 1,
                  userId: currentUserId,
                }),
              };
            }
            return {
              ...prevExercisesObject,
              [currentAttempt.exercise]: [{
                ...currentAttempt,
                index: 1,
                userId: currentUserId,
              }],
            };
          }, {}))
      ), []);

    const results = exerciseData
      .reduce((prevExercises, userExercises) => {
        const { readingExercises, ...rest } = Object.keys(userExercises)
          .reduce((prevUserExercises, currentExercise) => {
            const attempts = userExercises[currentExercise];
            const { userId } = attempts[0];
            const exerciseCount = attempts.length;
            const exerciseElapsedTime = attempts.map(({ elapsedTime }) => elapsedTime).reduce(reduceSumFunc, 0);
            const indeces = attempts.map(attempt => attempt.index);
            const finalIndex = Math.max(...indeces);
            const isReadingExercise = readingExerciseNames.indexOf(currentExercise) !== -1;
            let userExerciseResults = {
              userId,
              exerciseCount,
              exerciseElapsedTime,
            };
            if (isReadingExercise) {
              const readingSpeedResults = attempts.map(attempt => attempt.wordsPerMinute);
              const [readingSpeedSlope, readingSpeedIntercept] = leastSquares(indeces, readingSpeedResults);
              const initialReadingSpeed = readingSpeedIntercept + readingSpeedSlope;
              const finalReadingSpeed = readingSpeedIntercept + readingSpeedSlope * finalIndex;

              const comprehensionSpeedResults = attempts.map(attempt => attempt.comprehensionPerMinute);
              const [comprehensionSpeedSlope, comprehensionSpeedIntercept] = leastSquares(indeces, comprehensionSpeedResults);
              const initialComprehensionSpeed = comprehensionSpeedIntercept + comprehensionSpeedSlope;
              const finalComprehensionSpeed = comprehensionSpeedIntercept + comprehensionSpeedSlope * finalIndex;

              const comprehensionLevelResults = attempts.map(attempt => attempt.comprehensionResult);
              const [comprehensionLevelSlope, comprehensionLevelIntercept] = leastSquares(indeces, comprehensionLevelResults);
              const initialComprehensionLevel = comprehensionLevelIntercept + comprehensionLevelSlope;
              const finalComprehensionLevel = comprehensionLevelIntercept + comprehensionLevelSlope * finalIndex;

              userExerciseResults = {
                ...userExerciseResults,
                initialReadingSpeed,
                finalReadingSpeed,
                initialComprehensionSpeed,
                finalComprehensionSpeed,
                initialComprehensionLevel,
                finalComprehensionLevel,
              };
            } else {
              const exerciseSpeedResults = attempts.map(attempt => attempt.symbolsPerMinute);
              const [exerciseSpeedSlope, exerciseSpeedIntercept] = leastSquares(indeces, exerciseSpeedResults);
              const initialExerciseSpeed = exerciseSpeedIntercept + exerciseSpeedSlope;
              const finalExerciseSpeed = exerciseSpeedIntercept + exerciseSpeedSlope * finalIndex;
              userExerciseResults = {
                ...userExerciseResults,
                initialExerciseSpeed,
                finalExerciseSpeed,
              };
            }

            return {
              ...prevUserExercises,
              [currentExercise]: prevExercises[currentExercise] ?
                prevExercises[currentExercise].concat(userExerciseResults) : [userExerciseResults],
              readingExercises: isReadingExercise ?
                prevUserExercises.readingExercises.concat(userExerciseResults) : prevUserExercises.readingExercises,
            };
          }, { readingExercises: [] });
        return {
          ...prevExercises,
          readingExercises: prevExercises.readingExercises.concat(...readingExercises),
          ...rest,
        };
      }, { readingExercises: [] });

    const aggregatedResults = Object.keys(results)
      .reduce((prevExercisesResults, currentExercise) => {
        const exerciseResults = results[currentExercise];
        if (exerciseResults.length === 0) {
          return prevExercisesResults;
        }
        const totalExerciseCount = exerciseResults.map(({ exerciseCount }) => exerciseCount).reduce(reduceSumFunc, 0);
        const totalExerciseElapsedTime = exerciseResults.map(({ exerciseElapsedTime }) => exerciseElapsedTime).reduce(reduceSumFunc, 0);
        const averageExerciseCount = totalExerciseCount / userCount;
        const isReadingExercise = readingExerciseNames.indexOf(currentExercise) !== -1;
        let aggregatedResult = {
          totalExerciseCount,
          totalExerciseElapsedTime,
          averageExerciseCount,
        };
        if (isReadingExercise) {
          const averageInitialReadingSpeed = getAverage(exerciseResults.map(({ initialReadingSpeed }) => initialReadingSpeed));
          const averageFinalReadingSpeed = getAverage(exerciseResults.map(({ finalReadingSpeed }) => finalReadingSpeed));
          const averageReadingSpeedChange = averageFinalReadingSpeed - averageInitialReadingSpeed;
          const averageReadingSpeedChangePercentage = (averageReadingSpeedChange / averageInitialReadingSpeed) * 100;

          const averageInitialComprehensionSpeed = getAverage(exerciseResults.map(({ initialComprehensionSpeed }) => initialComprehensionSpeed));
          const averageFinalComprehensionSpeed = getAverage(exerciseResults.map(({ finalComprehensionSpeed }) => finalComprehensionSpeed));
          const averageComprehensionSpeedChange = averageFinalComprehensionSpeed - averageInitialComprehensionSpeed;
          const averageComprehensionSpeedChangePercentage = (averageComprehensionSpeedChange / averageInitialComprehensionSpeed) * 100;

          const averageInitialComprehensionLevel = getAverage(exerciseResults.map(({ initialComprehensionLevel }) => initialComprehensionLevel));
          const averageFinalComprehensionLevel = getAverage(exerciseResults.map(({ finalComprehensionLevel }) => finalComprehensionLevel));
          const averageComprehensionLevelChange = averageFinalComprehensionLevel - averageInitialComprehensionLevel;
          const averageComprehensionLevelChangePercentage = (averageComprehensionLevelChange / averageInitialComprehensionLevel) * 100;
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
        } else {
          const averageInitialExerciseSpeed = getAverage(exerciseResults.map(({ initialExerciseSpeed }) => initialExerciseSpeed));
          const averageFinalExerciseSpeed = getAverage(exerciseResults.map(({ finalExerciseSpeed }) => finalExerciseSpeed));
          const averageExerciseSpeedChange = averageFinalExerciseSpeed - averageInitialExerciseSpeed;
          const averageExerciseSpeedChangePercentage = (averageExerciseSpeedChange / averageInitialExerciseSpeed) * 100;
          aggregatedResult = {
            ...aggregatedResult,
            averageInitialExerciseSpeed,
            averageFinalExerciseSpeed,
            averageExerciseSpeedChangePercentage,
          };
        }

        return {
          ...prevExercisesResults,
          [currentExercise]: aggregatedResult,
        };
      }, {});
    return (
      <Fragment>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.exercise')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-count')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-elapsed-time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {`${this.props.translate('group-statistics-table.average-exercise-count-per-user')} (${userCount})`}
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
            {readingExerciseNames
              .map((exercise) => {
                const totalExerciseCount = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].totalExerciseCount : 0;
                const totalExerciseElapsedTime = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].totalExerciseElapsedTime : 0;
                const averageExerciseCount = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageExerciseCount : 0;
                const averageInitialReadingSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageInitialReadingSpeed : 0;
                const averageFinalReadingSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageFinalReadingSpeed : 0;
                const averageReadingSpeedChangePercentage = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageReadingSpeedChangePercentage : 0;
                return (
                  <Table.Row key={exercise}>
                    <Table.Cell>
                      {this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}
                    </Table.Cell>
                    <Table.Cell
                      warning={totalExerciseCount === 0}
                    >
                      {totalExerciseCount.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={totalExerciseElapsedTime === 0}
                    >
                      {formatMillisecondsInHours(totalExerciseElapsedTime)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageExerciseCount === 0}
                    >
                      {averageExerciseCount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageInitialReadingSpeed === 0}
                    >
                      {averageInitialReadingSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageFinalReadingSpeed === 0}
                    >
                      {averageFinalReadingSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      negative={averageReadingSpeedChangePercentage < 0}
                      warning={averageReadingSpeedChangePercentage === 0}
                      positive={averageReadingSpeedChangePercentage > 0}
                    >
                      {`${averageReadingSpeedChangePercentage > 0 ? '+' : ''}${averageReadingSpeedChangePercentage.toFixed(2)}%`}
                    </Table.Cell>
                  </Table.Row>);
              })}
          </Table.Body>
        </Table>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.exercise')}
              </Table.HeaderCell>
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
            {readingExerciseNames
              .map((exercise) => {
                const averageInitialComprehensionSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageInitialComprehensionSpeed : 0;
                const averageFinalComprehensionSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageFinalComprehensionSpeed : 0;
                const averageComprehensionSpeedChangePercentage = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageComprehensionSpeedChangePercentage : 0;
                const averageInitialComprehensionLevel = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageInitialComprehensionLevel : 0;
                const averageFinalComprehensionLevel = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageFinalComprehensionLevel : 0;
                const averageComprehensionLevelChangePercentage = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageComprehensionLevelChangePercentage : 0;
                return (
                  <Table.Row key={exercise}>
                    <Table.Cell>
                      {this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageInitialComprehensionSpeed === 0}
                    >
                      {averageInitialComprehensionSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageFinalComprehensionSpeed === 0}
                    >
                      {averageFinalComprehensionSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      negative={averageComprehensionSpeedChangePercentage < 0}
                      warning={averageComprehensionSpeedChangePercentage === 0}
                      positive={averageComprehensionSpeedChangePercentage > 0}
                    >
                      {`${averageComprehensionSpeedChangePercentage > 0 ? '+' : ''}${averageComprehensionSpeedChangePercentage.toFixed(2)}%`}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageInitialComprehensionLevel === 0}
                    >
                      {averageInitialComprehensionLevel.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageFinalComprehensionLevel === 0}
                    >
                      {averageFinalComprehensionLevel.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      negative={averageComprehensionLevelChangePercentage < 0}
                      warning={averageComprehensionLevelChangePercentage === 0}
                      positive={averageComprehensionLevelChangePercentage > 0}
                    >
                      {`${averageComprehensionLevelChangePercentage > 0 ? '+' : ''}${averageComprehensionLevelChangePercentage.toFixed(2)}%`}
                    </Table.Cell>
                  </Table.Row>);
              })}
          </Table.Body>
        </Table>
        <Table basic celled selectable textAlign="center" compact fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.exercise')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-count')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.total-exercise-elapsed-time')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {`${this.props.translate('group-statistics-table.average-exercise-count-per-user')} (${userCount})`}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-initial-exercise-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-final-exercise-speed')}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {this.props.translate('group-statistics-table.average-exercise-speed-change-percentage')}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {helpExerciseNames
              .map((exercise) => {
                const totalExerciseCount = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].totalExerciseCount : 0;
                const totalExerciseElapsedTime = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].totalExerciseElapsedTime : 0;
                const averageExerciseCount = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageExerciseCount : 0;
                const averageInitialExerciseSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageInitialExerciseSpeed : 0;
                const averageFinalExerciseSpeed = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageFinalExerciseSpeed : 0;
                const averageExerciseSpeedChangePercentage = aggregatedResults[exercise] ?
                  aggregatedResults[exercise].averageExerciseSpeedChangePercentage : 0;
                return (
                  <Table.Row key={exercise}>
                    <Table.Cell>
                      {this.props.translate(`statistics.${exerciseTranslateMapping[exercise]}`)}
                    </Table.Cell>
                    <Table.Cell
                      warning={totalExerciseCount === 0}
                    >
                      {totalExerciseCount.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={totalExerciseElapsedTime === 0}
                    >
                      {formatMillisecondsInHours(totalExerciseElapsedTime)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageExerciseCount === 0}
                    >
                      {averageExerciseCount.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageInitialExerciseSpeed === 0}
                    >
                      {averageInitialExerciseSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      warning={averageFinalExerciseSpeed === 0}
                    >
                      {averageFinalExerciseSpeed.toFixed(0)}
                    </Table.Cell>
                    <Table.Cell
                      negative={averageExerciseSpeedChangePercentage < 0}
                      warning={averageExerciseSpeedChangePercentage === 0}
                      positive={averageExerciseSpeedChangePercentage > 0}
                    >
                      {`${averageExerciseSpeedChangePercentage > 0 ? '+' : ''}${averageExerciseSpeedChangePercentage.toFixed(2)}%`}
                    </Table.Cell>
                  </Table.Row>);
              })}
          </Table.Body>
        </Table>
        {this.props.isTeacher ?
          <Button
            icon
            basic
            floated="right"
            size="large"
            color="blue"
            disabled={Object.keys(results).length <= 1}
            onClick={() => this.exportData(results)}
          >
            {`${this.props.translate('statistics-table.export')} `}
            <Icon name="download" />
          </Button> : null}
      </Fragment>
    );
  }
}

export default GroupTable;
