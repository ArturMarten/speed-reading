import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import renderWithRedux from '../../../utils/testUtils';
import HelpExerciseContainer from './HelpExerciseContainer';

jest.mock('react-responsive', () => {
  return (props) => (props.maxWidth === 991 ? props.children : null);
});

test('shows schulte tables exercise', async () => {
  const { translate } = renderWithRedux(<HelpExerciseContainer type="schulteTables" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-schulteTables'));
  expect(screen.getByText(translate('exercises.description-schulteTables'))).toBeInTheDocument();

  fireEvent.click(screen.getByText(translate('exercise-preparation.proceed')));

  const finishButton = screen.getByLabelText(translate('timing.stop'));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('help-exercise-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('help-exercise-results.retry')));
  expect(screen.queryByText(translate('help-exercise-results.modal-header'))).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(translate('timing.start')));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('help-exercise-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('help-exercise-results.end')));
});

test('shows concentration exercise', async () => {
  const { translate } = renderWithRedux(<HelpExerciseContainer type="concentration" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-concentration'));
  expect(screen.getByText(translate('exercises.description-concentration'))).toBeInTheDocument();

  fireEvent.click(screen.getByText(translate('exercise-preparation.more-settings')));
  fireEvent.click(screen.getByText(translate('exercise-preview.show')));
  fireEvent.click(screen.getByText(translate('exercise-preview.hide')));
  fireEvent.click(screen.getByText(translate('exercise-preparation.more-settings')));

  fireEvent.click(screen.getByText(translate('exercise-preparation.proceed')));

  const finishButton = screen.getByLabelText(translate('timing.stop'));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('help-exercise-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('help-exercise-results.retry')));
  expect(screen.queryByText(translate('help-exercise-results.modal-header'))).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(translate('timing.start')));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('help-exercise-results.modal-header'))).toBeInTheDocument());
  // TODO: fireEvent.click(screen.getByText(translate('help-exercise-results.end')));
});
