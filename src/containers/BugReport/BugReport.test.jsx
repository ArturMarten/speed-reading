import { fireEvent, waitFor } from '@testing-library/react';
import axiosMock from 'axios';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import BugReport from './BugReport';

it('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, queryByText, baseElement, rerender } = renderWithRedux(<BugReport open onClose={onClose} />);
  expect(queryByText(translate('bug-report.modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<BugReport open={false} />);
  expect(queryByText(translate('bug-report.modal-header'))).toBeNull();
});

it('submits bug report', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Bug report added',
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<BugReport open />);
  fireEvent.change(getByLabelText(translate('bug-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('bug-report.send')));
  await waitFor(() => getByText(translate('success.bug-report-added')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith(
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
});

it('shows error', async () => {
  axiosMock.post.mockRejectedValueOnce({
    response: {
      data: {
        error: 'Network Error',
      },
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<BugReport open />);
  fireEvent.change(getByLabelText(translate('bug-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('bug-report.send')));
  await waitFor(() => getByText(translate('error.network-error')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
});
