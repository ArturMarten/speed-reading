import { screen } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import ApplicationStatistics from './ApplicationStatistics';

test('fetches application statistics', async () => {
  renderWithRedux(<ApplicationStatistics translate={jest.fn()} />);
  await screen.findByText(/138h 53m/i);
});
