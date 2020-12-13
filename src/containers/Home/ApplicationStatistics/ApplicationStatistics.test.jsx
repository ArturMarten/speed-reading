import { waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import ApplicationStatistics from './ApplicationStatistics';

test('fetches application statistics', async () => {
  const { getByText } = renderWithRedux(<ApplicationStatistics translate={jest.fn()} />);
  await waitFor(() => getByText(/138h 53m/i));
});
