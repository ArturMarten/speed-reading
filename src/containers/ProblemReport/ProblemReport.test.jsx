import { fireEvent, waitForElement } from '@testing-library/react';
import axiosMock from 'axios';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import ProblemReport from './ProblemReport';

it('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, queryByText, baseElement, rerender } = renderWithRedux(<ProblemReport open onClose={onClose} />);
  expect(queryByText(translate('problem-report.modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<ProblemReport open={false} />);
  expect(queryByText(translate('problem-report.modal-header'))).toBeNull();
});

it('submits problem report', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Problem report added',
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<ProblemReport open />);
  fireEvent.change(getByLabelText(translate('problem-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('problem-report.send')));
  await waitForElement(() => getByText(translate('success.problem-report-added')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith('/problemReports', {
    userId: null,
    type: 'text',
    textTitle: null,
    description: 'test',
    screenshot: null,
  });
});

it('shows error', async () => {
  axiosMock.post.mockRejectedValueOnce({
    response: {
      data: {
        error: 'Network Error',
      },
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<ProblemReport open />);
  fireEvent.change(getByLabelText(translate('problem-report.textarea-description')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('problem-report.send')));
  await waitForElement(() => getByText(translate('error.network-error')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
});
