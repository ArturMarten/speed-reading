import React from 'react';

import GroupTable from './GroupTable';
import renderWithRedux from '../../utils/testUtils';

const exampleData = {
  user1: [
    {
      id: 1,
      exercise: 'readingTest',
      elapsedTime: 100000,
      wordsPerMinute: 100,
      comprehensionPerMinute: 90,
      comprehensionResult: 90,
    },
    {
      id: 2,
      exercise: 'readingAid',
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
      elapsedTime: 85000,
      wordsPerMinute: 120,
      comprehensionPerMinute: 96,
      comprehensionResult: 80,
    },
    {
      id: 4,
      exercise: 'readingTest',
      elapsedTime: 80000,
      wordsPerMinute: 130,
      comprehensionPerMinute: 111,
      comprehensionResult: 85,
    },
  ],
};

it('renders empty table', () => {
  const { container, queryAllByText } = renderWithRedux(
    <GroupTable data={{}} timeFilter={() => true} filterOutliers={false} isTeacher={false} minimumAttemptCount={0} />,
    { useTranslate: true },
  );
  const rows = container.querySelectorAll('tr');
  expect(rows.length).toBe(17);
  expect(queryAllByText('0').length).toBe(44);
  expect(queryAllByText('0h 00m').length).toBe(8);
  expect(queryAllByText('0.00').length).toBe(8);
  expect(queryAllByText('0.00%').length).toBe(18);
});

it('renders table with data', () => {
  const { translate, queryByText, queryAllByText } = renderWithRedux(
    <GroupTable
      data={exampleData}
      timeFilter={() => true}
      filterOutliers={false}
      isTeacher={false}
      minimumAttemptCount={0}
    />,
    { useTranslate: true },
  );
  expect(
    queryByText(`${translate('group-statistics-table.average-exercise-count-per-user', { userCount: 2 })}`),
  ).not.toBeNull();
  expect(queryByText('0h 05m')).not.toBeNull();
  expect(queryByText('+3.23%')).not.toBeNull();
  expect(queryByText('0h 04m')).not.toBeNull();
  expect(queryByText('+4.55%')).not.toBeNull();
  expect(queryByText('0h 01m')).not.toBeNull();
  expect(queryByText('+5.62%')).not.toBeNull();
  expect(queryByText('+1.92%')).not.toBeNull();
  expect(queryByText('+8.06%')).not.toBeNull();
  expect(queryByText('+2.94%')).not.toBeNull();
  expect(queryAllByText('0h 00m').length).toBe(5);
  expect(queryAllByText('0.00%').length).toBe(12);
});
