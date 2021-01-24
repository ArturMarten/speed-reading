import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import TextExercisePreparation from './TextExercisePreparation';

test('stores own text', async () => {
  const { translate, baseElement } = renderWithRedux(
    <TextExercisePreparation type="readingTest" onProceed={jest.fn()} />,
  );
  expect(screen.queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument();
  fireEvent.click(screen.getByText(translate('exercise-preparation.use-own-text')));
  expect(screen.queryByText(translate('own-text-editor.modal-header'))).toBeInTheDocument();

  const text = 'Test';

  fireEvent.paste(baseElement.querySelector('.public-DraftEditor-content'), {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await waitFor(() => expect(baseElement.querySelector('.public-DraftEditor-content')).toHaveTextContent(text));

  fireEvent.click(screen.getByText(translate('own-text-editor.use')));
  /*
  expect(submit).toBeCalledWith('/analyze', {
    language: 'estonian',
    text,
  });
  */

  await waitFor(() => expect(screen.queryByText(translate('own-text-editor.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('exercise-preparation.use-own-text')));
  expect(baseElement.querySelector('.public-DraftEditor-content')).toHaveTextContent(text);
});
