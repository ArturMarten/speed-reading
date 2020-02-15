import { fireEvent, waitForElement } from '@testing-library/react';
import axiosMock from 'axios';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import Feedback from './Feedback';

it('opens and closes the modal', () => {
  const onClose = jest.fn();
  const { translate, queryByText, queryAllByText, baseElement, rerender } = renderWithRedux(
    <Feedback open onClose={onClose} />,
  );
  expect(queryAllByText(translate('feedback.modal-header'))).toHaveLength(2);
  fireEvent.click(baseElement.querySelector('i.close.icon'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<Feedback open={false} />);
  expect(queryByText(translate('feedback.modal-header'))).toBeNull();
});

it('submits feedback', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Feedback added',
    },
  });
  const { translate, getByText, getByLabelText } = renderWithRedux(<Feedback open />);
  fireEvent.change(getByLabelText(translate('feedback.textarea-message')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('feedback.send')));
  await waitForElement(() => getByText(translate('success.feedback-added')));
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
