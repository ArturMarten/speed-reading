import React from 'react';
import { screen } from '@testing-library/react';

import GroupTable from './GroupTable';
import { getExerciseId } from '../../../store/reducers/exercise';
import renderWithRedux from '../../../utils/testUtils';

const exampleData = {
  user1: [
    {
      id: 1,
      exercise: 'readingTest',
      exerciseId: getExerciseId('readingTest')[0],
      elapsedTime: 100000,
      wordsPerMinute: 100,
      comprehensionPerMinute: 90,
      comprehensionResult: 90,
    },
    {
      id: 2,
      exercise: 'readingAid',
      exerciseId: getExerciseId('readingAid')[0],
      elapsedTime: 90000,
      wordsPerMinute: 90,
      comprehensionPerMinute: 81,
      comprehensionResult: 90,
    },
  ],
  user2: [
    {
      id: 3,
      exercise: 'readingTest',
      exerciseId: getExerciseId('readingTest')[0],
      elapsedTime: 85000,
      wordsPerMinute: 120,
      comprehensionPerMinute: 96,
      comprehensionResult: 80,
    },
    {
      id: 4,
      exercise: 'readingTest',
      exerciseId: getExerciseId('readingTest')[0],
      elapsedTime: 80000,
      wordsPerMinute: 130,
      comprehensionPerMinute: 111,
      comprehensionResult: 85,
    },
  ],
};

test('renders empty table', () => {
  const { container } = renderWithRedux(
    <GroupTable data={{}} timeFilter={() => true} isTeacher={false} minimumAttemptCount={0} />,
    { useTranslate: true },
  );
  const rows = container.querySelectorAll('tr');
  expect(rows.length).toBe(34);
  expect(screen.queryAllByText('0').length).toBe(51);
  expect(screen.queryAllByText('0h 00m').length).toBe(17);
  expect(screen.queryAllByText('0.00').length).toBe(17);
  expect(screen.queryAllByText('0.00%').length).toBe(39);
});

test('renders table with data', () => {
  const { translate } = renderWithRedux(
    <GroupTable data={exampleData} timeFilter={() => true} isTeacher={false} minimumAttemptCount={0} />,
    { useTranslate: true },
  );
  expect(
    screen.queryByText(`${translate('group-statistics-table.average-exercise-count-per-user', { userCount: 2 })}`),
  ).toBeInTheDocument();
  expect(screen.queryByText('0h 05m')).toBeInTheDocument();
  expect(screen.queryByText('0h 04m')).toBeInTheDocument();
  expect(screen.queryByText('+4.55%')).toBeInTheDocument();
  expect(screen.queryByText('0h 01m')).toBeInTheDocument();
  expect(screen.queryByText('+3.23%')).toBeInTheDocument();
  expect(screen.queryByText('+8.06%')).toBeInTheDocument();
  expect(screen.queryAllByText('+2.94%').length).toBe(2);
  expect(screen.queryAllByText('0h 00m').length).toBe(14);
  expect(screen.queryAllByText('0.00%').length).toBe(34);
});
