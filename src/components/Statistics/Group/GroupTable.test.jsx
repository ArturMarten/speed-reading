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
  expect(rows.length).toBe(30);
  expect(screen.queryAllByText('0').length).toBe(49);
  expect(screen.queryAllByText('0h 00m').length).toBe(15);
  expect(screen.queryAllByText('0.00').length).toBe(15);
  expect(screen.queryAllByText('0.00%').length).toBe(35);
});

test('renders table with data', () => {
  const { translate } = renderWithRedux(
    <GroupTable data={exampleData} timeFilter={() => true} isTeacher={false} minimumAttemptCount={0} />,
    { useTranslate: true },
  );
  expect(
    screen.queryByText(`${translate('group-statistics-table.average-exercise-count-per-user', { userCount: 2 })}`),
  ).not.toBeNull();
  expect(screen.queryByText('0h 05m')).not.toBeNull();
  expect(screen.queryByText('0h 04m')).not.toBeNull();
  expect(screen.queryByText('+4.55%')).not.toBeNull();
  expect(screen.queryByText('0h 01m')).not.toBeNull();
  expect(screen.queryByText('+3.23%')).not.toBeNull();
  expect(screen.queryByText('+8.06%')).not.toBeNull();
  expect(screen.queryAllByText('+2.94%').length).toBe(2);
  expect(screen.queryAllByText('0h 00m').length).toBe(12);
  expect(screen.queryAllByText('0.00%').length).toBe(30);
});
