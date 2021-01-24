import { screen, getByText, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import * as utility from '../../shared/utility';
import renderWithRedux from '../../utils/testUtils';
import Statistics from './Statistics';

test('shows table tab initially', async () => {
  const { translate } = renderWithRedux(<Statistics />, { token: '' });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('statistics.title'));
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());

  const table = screen.getByRole('table');
  getByText(table, translate('statistics-table.exercise'));
  getByText(table, translate('statistics-table.modification'));
  getByText(table, translate('statistics-table.attempt-date'));
  getByText(table, translate('statistics-table.reading-attempt'));
  // getByText(table, translate('statistics-table.reading-speed'));
  getByText(table, translate('statistics-table.test-result'));
  getByText(table, translate('statistics-table.comprehension-level'));
  // getByText(table, translate('statistics-table.comprehension-speed'));
});

test('shows regression tab when clicked', async () => {
  const { translate } = renderWithRedux(<Statistics />, { token: '' });
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('statistics.regression')));
});

test('shows group table tab when clicked', async () => {
  const { translate } = renderWithRedux(<Statistics />, { token: '', groupId: 1 });
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('statistics.group-table')));
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());

  const groupTables = screen.getAllByRole('table');
  expect(groupTables.length).toBe(5);
});

test('shows group table tab when clicked as a teacher', async () => {
  const { translate } = renderWithRedux(<Statistics />, { token: '', role: 'teacher' });
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('statistics.group-table')));
  await waitFor(() => expect(screen.queryByText(translate('statistics.fetching-data'))).not.toBeInTheDocument());

  const exportButton = screen.getByText(translate('statistics-table.export'));
  expect(exportButton).toBeEnabled();

  utility.downloadExcelData = jest.fn();
  fireEvent.click(exportButton);
  await waitFor(() => expect(utility.downloadExcelData).toHaveBeenCalledTimes(1));
  expect(utility.downloadExcelData).toHaveBeenCalledWith(
    expect.any(Uint8Array),
    expect.any(String),
    expect.any(String),
  );
  jest.clearAllMocks();
});
