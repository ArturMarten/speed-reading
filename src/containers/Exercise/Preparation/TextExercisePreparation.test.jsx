import React from 'react';
import axiosMock from 'axios';
import { fireEvent, wait } from 'react-testing-library';

import TextExercisePreparation from './TextExercisePreparation';
import renderWithRedux from '../../../utils/testUtils';

it('stores own text', async () => {
  axiosMock.post.mockResolvedValueOnce({
    data: {
      characterCount: 4,
      wordCount: 1,
      sentenceCount: 1,
    },
  });

  const { translate, getByText, queryByText, getByRole } = renderWithRedux(
    <TextExercisePreparation type="readingTest" onProceed={jest.fn()} />,
  );
  expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument();
  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(queryByText(translate('own-text-editor.modal-header'))).toBeInTheDocument();

  const text = 'Test';

  fireEvent.paste(getByRole('textbox'), {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await wait(() => expect(getByRole('textbox').textContent).toEqual(text));

  fireEvent.click(getByText(translate('own-text-editor.use')));
  expect(axiosMock.post).toBeCalledTimes(1);
  expect(axiosMock.post).toBeCalledWith('/analyze', {
    language: 'estonian',
    text,
  });

  await wait(() => expect(queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(getByText(translate('exercise-preparation.use-own-text')));
  expect(getByRole('textbox').textContent).toEqual(text);
});
