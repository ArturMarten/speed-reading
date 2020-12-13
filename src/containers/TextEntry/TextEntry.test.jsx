import { fireEvent, waitFor } from '@testing-library/react';
import axiosMock from 'axios';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import TextEntry from './TextEntry';

it('submits new text', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      message: 'Reading text added',
    },
  });
  const { getByLabelText, translate, getByText } = renderWithRedux(<TextEntry />);
  fireEvent.change(getByLabelText(translate('text-entry.text-title')), { target: { value: 'title' } });
  fireEvent.change(getByLabelText(translate('text-entry.text-author')), { target: { value: 'author' } });
  fireEvent.click(getByText(translate('text-entry.add-text')));
  await waitFor(() => getByText(translate('success.reading-text-added')));
  expect(axiosMock.post).toHaveBeenCalledTimes(1);
  expect(axiosMock.post).toHaveBeenCalledWith(
    '/texts',
    expect.objectContaining({
      title: 'title',
      author: 'author',
      collectionId: null,
      editor: '',
      questionsAuthor: '',
      reference: '',
      plainText: '',
      contentState: expect.any(Object),
      complexity: 0,
      keywords: [],
    }),
  );
});
