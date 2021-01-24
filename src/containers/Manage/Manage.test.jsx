import { fireEvent, waitFor, screen, getByText, findByText } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Manage from './Manage';

test('shows users tab initially', async () => {
  const { translate } = renderWithRedux(<Manage />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('manage.title'));
  expect(screen.queryByText(translate('manage.bug-reports'))).not.toBeInTheDocument();
  // getByLabelText(translate('manage-users.group'));
  expect(screen.getByText(translate('manage.users'))).toBeInTheDocument();

  expect(screen.getByText(translate('manage-users.fetching-users'))).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(translate('manage-users.fetching-users'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('manage-users.refresh')));
  expect(screen.getByText(translate('manage-users.fetching-users'))).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(translate('manage-users.fetching-users'))).not.toBeInTheDocument());

  const table = screen.getByRole('table');
  getByText(table, translate('manage-users.group'));
  getByText(table, translate('manage-users.first-name'));
  getByText(table, translate('manage-users.last-name'));

  fireEvent.click(screen.getByText(translate('manage-users.add-user')));
  expect(screen.getByText(translate('user-editor.modal-header-new'))).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText(translate('user-editor.insert-new-placeholder')), {
    target: { value: 'test@test.com' },
  });
  fireEvent.click(screen.getByText(translate('user-editor.add-user')));
  await findByText(table, 'test@test.com');
});

test('shows groups tab when clicked', async () => {
  const { translate } = renderWithRedux(<Manage />);
  fireEvent.click(screen.getByText(translate('manage.groups')));

  expect(screen.getByText(translate('manage-groups.fetching-groups'))).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(translate('manage-groups.fetching-groups'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('manage-groups.refresh')));
  expect(screen.getByText(translate('manage-groups.fetching-groups'))).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText(translate('manage-groups.fetching-groups'))).not.toBeInTheDocument());

  const table = screen.getByRole('table');
  getByText(table, translate('manage-groups.group'));
  getByText(table, translate('manage-groups.creation-date'));
  getByText(table, translate('manage-groups.user-count'));
  getByText(table, 'Group 1');

  fireEvent.click(screen.getByText(translate('manage-groups.add-group')));
  expect(screen.getByText(translate('group-editor.modal-header-new'))).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText(translate('group-editor.insert-new-placeholder')), {
    target: { value: 'Group 2' },
  });
  fireEvent.click(screen.getByText(translate('group-editor.add-group')));
  await findByText(table, 'Group 2');
});

test('shows feedback tab when clicked', async () => {
  const { translate } = renderWithRedux(<Manage />);
  fireEvent.click(screen.getByText(translate('manage.feedback')));

  expect(screen.getByText(translate('manage-feedback.fetching-feedback'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-feedback.fetching-feedback'))).not.toBeInTheDocument(),
  );

  fireEvent.click(screen.getByText(translate('manage-feedback.refresh')));
  expect(screen.getByText(translate('manage-feedback.fetching-feedback'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-feedback.fetching-feedback'))).not.toBeInTheDocument(),
  );

  const table = screen.getByRole('table');
  getByText(table, translate('manage-feedback.date'));
  getByText(table, translate('manage-feedback.user'));
  getByText(table, translate('manage-feedback.message'));
  getByText(table, translate('manage-feedback.rating'));

  getByText(table, translate('manage-feedback.user-anonymous'));
  getByText(table, 'Some feedback');
  getByText(table, translate('manage-feedback.functionality-rating'));
  getByText(table, translate('manage-feedback.usability-rating'));
  getByText(table, translate('manage-feedback.design-rating'));
});

test('shows problem reports tab when clicked', async () => {
  const { translate } = renderWithRedux(<Manage />);
  fireEvent.click(screen.getByText(translate('manage.problem-reports')));

  expect(screen.getByText(translate('manage-problem-reports.fetching-problem-reports'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-problem-reports.fetching-problem-reports'))).not.toBeInTheDocument(),
  );

  fireEvent.click(screen.getByText(translate('manage-problem-reports.refresh')));
  expect(screen.getByText(translate('manage-problem-reports.fetching-problem-reports'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-problem-reports.fetching-problem-reports'))).not.toBeInTheDocument(),
  );

  const table = screen.getByRole('table');
  getByText(table, translate('manage-problem-reports.date'));
  getByText(table, translate('manage-problem-reports.user'));
  getByText(table, translate('manage-problem-reports.description'));
  getByText(table, translate('manage-problem-reports.actions'));

  getByText(table, 'Text title');
  getByText(table, 'Some problem');
});

test('shows bug reports tab to admin when clicked', async () => {
  const { translate } = renderWithRedux(<Manage />, { role: 'admin' });
  fireEvent.click(screen.getByText(translate('manage.bug-reports')));

  expect(screen.getByText(translate('manage-bug-reports.fetching-bug-reports'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-bug-reports.fetching-bug-reports'))).not.toBeInTheDocument(),
  );

  fireEvent.click(screen.getByText(translate('manage-bug-reports.refresh')));
  expect(screen.getByText(translate('manage-bug-reports.fetching-bug-reports'))).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText(translate('manage-bug-reports.fetching-bug-reports'))).not.toBeInTheDocument(),
  );

  const table = screen.getByRole('table');
  getByText(table, translate('manage-bug-reports.date'));
  getByText(table, translate('manage-bug-reports.user'));
  getByText(table, translate('manage-bug-reports.resolved'));
  getByText(table, translate('manage-bug-reports.description'));
  getByText(table, translate('manage-bug-reports.actions'));

  getByText(table, 'Some bug');

  jest.spyOn(console, 'log').mockImplementation(() => {});
  fireEvent.click(getByText(table, translate('manage-bug-reports.log-info')));
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith({
    actions: expect.any(Array),
    consoleErrors: expect.any(Array),
    platform: expect.any(String),
    state: expect.any(Object),
    userAgent: expect.any(String),
    windowDimensions: [1024, 768],
  });
  console.log.mockRestore();
});
