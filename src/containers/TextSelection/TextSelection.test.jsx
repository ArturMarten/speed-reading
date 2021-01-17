import React from 'react';
import { getByText, screen, waitFor } from '@testing-library/react';
import renderWithRedux from '../../utils/testUtils';
import TextSelection from './TextSelection';

test('shows text selection', async () => {
  const onClose = jest.fn();
  const { translate } = renderWithRedux(<TextSelection open onClose={onClose} />);
  screen.getByText(translate('text-selection.modal-header'));
  screen.getByText(translate('text-selection.fetching'));
  await waitFor(() => expect(screen.queryByText(translate('text-selection.fetching'))).not.toBeInTheDocument());

  const table = screen.getByRole('table');
  getByText(table, translate('text-selection.title-and-author'));
  getByText(table, translate('text-selection.user-reading-attempt-count'));
  getByText(table, translate('text-selection.word-count'));
  getByText(table, translate('text-selection.word-class-rating'));
  getByText(table, translate('text-selection.sentence-class-rating'));
  getByText(table, translate('text-selection.interestingness'));
});
