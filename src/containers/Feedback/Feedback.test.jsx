import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { server, apiURL, rest } from '../../test/server';
import renderWithRedux from '../../utils/testUtils';
import Feedback from './Feedback';

test('opens and closes the modal', () => {
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

test('submits feedback', async () => {
  const { translate, getByText, getByLabelText } = renderWithRedux(<Feedback open />);
  fireEvent.change(getByLabelText(translate('feedback.textarea-message')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('feedback.send')));
  await waitFor(() => getByText(translate('success.feedback-added')));
  /*
  expect(submit).toHaveBeenCalledWith('/feedback', {
    userId: null,
    message: 'test',
    functionalityRating: 0,
    usabilityRating: 0,
    designRating: 0,
  });
  */
});

test('shows error', async () => {
  server.use(
    rest.post(`${apiURL}/feedback`, async (req, res, ctx) => {
      return res(500, ctx.json({ error: 'Network Error' }));
    }),
  );
  const { translate, getByText, getByLabelText } = renderWithRedux(<Feedback open />);
  fireEvent.change(getByLabelText(translate('feedback.textarea-message')), { target: { value: 'test' } });
  fireEvent.click(getByText(translate('feedback.send')));
  await waitFor(() => getByText(translate('error.network-error')));
});
