import React from 'react';
import { waitForElement } from 'react-testing-library';
import axiosMock from 'axios';
import renderWithRedux from '../../../utils/testUtils';

import ApplicationStatistics from './ApplicationStatistics';

it('fetches application statistics', async () => {
  axiosMock.get.mockResolvedValueOnce({
    data: {
      exerciseAttemptCount: 1000,
      feedbackCount: 5,
      helpExerciseTime: 150000000,
      questionCount: 1000,
      readingExerciseTime: 250000000,
      testTime: 100000000,
      textCount: 200,
      totalTime: 500000000,
      userCount: 100,
    },
  });
  const { getByText } = renderWithRedux(<ApplicationStatistics translate={jest.fn()} />);
  await waitForElement(() => getByText(/138h 53m/i));
});
