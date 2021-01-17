import { fireEvent, getByText, screen, waitFor } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import TextEntry from './TextEntry';

test('can submit new text', async () => {
  const { translate } = renderWithRedux(<TextEntry />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('text-entry.title'));
  screen.getByText(translate('text-entry.description'));

  fireEvent.change(screen.getByLabelText(translate('text-entry.text-title')), { target: { value: 'title' } });
  fireEvent.change(screen.getByLabelText(translate('text-entry.text-author')), { target: { value: 'author' } });
  const text = 'New text';
  fireEvent.paste(document.querySelector('.public-DraftEditor-content'), {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await waitFor(() => expect(document.querySelector('.public-DraftEditor-content').textContent).toEqual(text));

  fireEvent.click(screen.getByText(translate('text-entry.analyze-text')));
  await waitFor(() => screen.getByText(translate('text-analysis.modal-header')));
  fireEvent.click(screen.getByText(translate('text-analysis.close')));
  await waitFor(() => expect(screen.queryByText(translate('text-analysis.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('text-entry.add-text')));
  await waitFor(() => screen.getByText(translate('success.reading-text-added')));
});

test('can change existing text', async () => {
  const { translate } = renderWithRedux(<TextEntry />);

  fireEvent.click(screen.getByText(translate('text-entry.select-text')));
  await waitFor(() => expect(screen.queryByText(translate('text-selection.fetching'))).not.toBeInTheDocument());

  const textSelectionModal = screen.getByText(translate('text-selection.modal-header')).parentElement;
  fireEvent.click(getByText(textSelectionModal, 'Reading text'));
  fireEvent.click(getByText(textSelectionModal, translate('exercise-preparation.select-text')));
  await waitFor(() => expect(screen.queryByText(translate('text-selection.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('text-entry.change-questions')));

  screen.getByText(translate('text-test-editor.modal-header'));

  fireEvent.click(screen.getByText(translate('text-test-editor.add-question')));

  fireEvent.change(screen.getByPlaceholderText(translate('question-editor.insert-new-placeholder')), {
    target: { value: 'New question?' },
  });
  fireEvent.click(screen.getByText(translate('question-editor.add-question')));

  await waitFor(() => expect(screen.queryByText(translate('text-test-editor.add-answer'))).toBeInTheDocument());
  fireEvent.click(screen.queryByText(translate('text-test-editor.add-answer')));
  fireEvent.change(screen.getByPlaceholderText(translate('answer-editor.insert-new-placeholder')), {
    target: { value: 'New answer' },
  });
  fireEvent.click(screen.getByText(translate('answer-editor.add-answer')));

  fireEvent.click(screen.getByText(translate('text-test-editor.ok')));

  fireEvent.click(screen.getByText(translate('text-entry.analyze-text')));
  await waitFor(() => screen.getByText(translate('text-analysis.modal-header')));
  fireEvent.click(screen.getByText(translate('text-analysis.close')));
  await waitFor(() => expect(screen.queryByText(translate('text-analysis.modal-header'))).not.toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('text-entry.modify-text')));
  await waitFor(() => screen.getByText(translate('success.reading-text-updated')));
});
