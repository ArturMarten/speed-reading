import { fireEvent, wait } from '@testing-library/react';
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

  const { translate, getByText, queryByText, getByRole, getAllByRole } = renderWithRedux(
    <TextExercisePreparation type="readingTest" onProceed={jest.fn()} />,
  );
  expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument();
  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(queryByText(translate('own-text-editor.modal-header'))).toBeInTheDocument();

  const text = 'Test';

  const editorIndex = 6;

  fireEvent.paste(getAllByRole('textbox')[editorIndex], {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await wait(() => expect(getAllByRole('textbox')[editorIndex].textContent).toEqual(text));

  fireEvent.click(getByText(translate('own-text-editor.use')));
  expect(axiosMock.post).toBeCalledTimes(1);
  expect(axiosMock.post).toBeCalledWith('/analyze', {
    language: 'estonian',
    text,
  });

  await wait(() => expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(getAllByRole('textbox')[editorIndex].textContent).toEqual(text);
});
