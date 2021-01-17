import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { server, apiURL, rest } from '../../test/server';
import renderWithRedux from '../../utils/testUtils';
import BugReport from './BugReport';

test('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, baseElement, rerender } = renderWithRedux(<BugReport open onClose={onClose} />);
  expect(screen.queryByText(translate('bug-report.modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<BugReport open={false} />);
  expect(screen.queryByText(translate('bug-report.modal-header'))).toBeNull();
});

test('submits bug report', async () => {
  const { translate } = renderWithRedux(<BugReport open />);
  fireEvent.change(screen.getByLabelText(translate('bug-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(screen.getByText(translate('bug-report.send')));
  await waitFor(() => screen.getByText(translate('success.bug-report-added')));
  /*
  expect(submit).toHaveBeenCalledWith(
    '/bugReports',
    expect.objectContaining({
      userId: null,
      description: 'test',
      version: expect.any(String),
      userAgent: expect.any(String),
      platform: expect.any(String),
      windowDimensions: [1024, 768],
      consoleErrors: [],
      state: expect.any(Object),
      actions: expect.any(Array),
      screenshot: null,
    }),
  );
  */
});

test('shows error', async () => {
  server.use(
    rest.post(`${apiURL}/bugReports`, async (req, res, ctx) => {
      return res(500, ctx.json({ error: 'Network Error' }));
    }),
  );
  const { translate } = renderWithRedux(<BugReport open />);
  fireEvent.change(screen.getByLabelText(translate('bug-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(screen.getByText(translate('bug-report.send')));
  await waitFor(() => screen.getByText(translate('error.network-error')));
});
