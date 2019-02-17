import React from 'react';
import { fireEvent, waitForElement } from 'react-testing-library';
import axiosMock from 'axios';
import renderWithRedux from '../../utils/testUtils';

import Feedback from './Feedback';

it('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, queryByText, baseElement, rerender } = renderWithRedux(<Feedback open onClose={onClose} />);
  expect(queryByText(translate('feedback.modal-header'))).not.toBeNull();
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<Feedback open={false} />);
  expect(queryByText(translate('feedback.modal-header'))).toBeNull();
});

it('submits feedback', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Problem report added',
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<Feedback open />);
  fireEvent.change(getByLabelText(translate('feedback.textarea-message')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('feedback.send')));
  await waitForElement(() => getByText(translate('success.problem-report-added')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith('/feedback', {
    userId: null,
    message: 'test',
    functionalityRating: 0,
    usabilityRating: 0,
    designRating: 0,
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
  const { translate, getByText, getByLabelText } = renderWithRedux(<Feedback open />);
  fireEvent.change(getByLabelText(translate('feedback.textarea-message')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('feedback.send')));
  await waitForElement(() => getByText(translate('error.network-error')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
});
