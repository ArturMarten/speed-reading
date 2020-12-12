import { fireEvent, waitFor } from '@testing-library/react';
import axiosMock from 'axios';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import TextExercisePreparation from './TextExercisePreparation';

it('stores own text', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      characterCount: 4,
      wordCount: 1,
      sentenceCount: 1,
    },
  });

  const { translate, getByText, queryByText, baseElement } = renderWithRedux(
    <TextExercisePreparation type="readingTest" onProceed={jest.fn()} />,
  );
  expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument();
  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(queryByText(translate('own-text-editor.modal-header'))).toBeInTheDocument();

  const text = 'Test';

  fireEvent.paste(baseElement.querySelector('.public-DraftEditor-content'), {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await waitFor(() => expect(baseElement.querySelector('.public-DraftEditor-content').textContent).toEqual(text));

  fireEvent.click(getByText(translate('own-text-editor.use')));
  expect(axiosMock.post).toBeCalledTimes(1);
  expect(axiosMock.post).toBeCalledWith('/analyze', {
    language: 'estonian',
    text,
  });

  await waitFor(() => expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(baseElement.querySelector('.public-DraftEditor-content').textContent).toEqual(text);
});
