import React from 'react';
import { fireEvent, getByText, screen, waitFor } from '@testing-library/react';
import renderWithRedux from '../../../utils/testUtils';
import TextExerciseContainer from './TextExerciseContainer';

jest.mock('react-responsive', () => {
  return (props) => (props.maxWidth === 991 ? props.children : null);
});

async function existingTextExercise(translate) {
  expect(screen.getByText(translate('exercise-preparation.text-not-selected'))).toBeInTheDocument();
  expect(screen.getByText(translate('exercise-preparation.text-required'))).toBeInTheDocument();
  fireEvent.click(screen.getByText(translate('exercise-preparation.select-text')));
  await waitFor(() => expect(screen.queryByText(translate('text-selection.fetching'))).not.toBeInTheDocument());

  const textSelectionModal = screen.getByText(translate('text-selection.modal-header')).parentElement;
  fireEvent.click(getByText(textSelectionModal, 'Reading text'));
  fireEvent.click(getByText(textSelectionModal, translate('exercise-preparation.select-text')));

  await waitFor(() =>
    expect(screen.queryByText(translate('exercise-preparation.text-not-selected'))).not.toBeInTheDocument(),
  );

  fireEvent.click(screen.getByText(translate('exercise-preparation.more-settings')));
  fireEvent.click(screen.getByText(translate('text-exercise-preview.hide')));
  fireEvent.click(screen.getByText(translate('text-exercise-preview.show')));
  fireEvent.click(screen.getByText(translate('exercise-preparation.more-settings')));

  fireEvent.click(screen.getByText(translate('exercise-preparation.proceed')));

  const finishButton = screen.getByLabelText(translate('timing.stop'));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('text-exercise-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('text-exercise-results.proceed')));

  expect(screen.getByText(translate('text-exercise-question-test.title'))).toBeInTheDocument();
  expect(screen.getByText(translate('text-exercise-question-test.description'))).toBeInTheDocument();
  const startTestButton = screen.getByText(translate('text-exercise-question-test.start-test'));
  await waitFor(() => expect(startTestButton).toBeEnabled());
  fireEvent.click(startTestButton);

  await waitFor(() => expect(screen.queryByText('1. Text question?')).toBeInTheDocument());
  fireEvent.click(screen.getByText('A ) Answer 1'));
  const finishTestButton = screen.getByText(translate('text-exercise-question-test.finish-test'));
  await waitFor(() => expect(finishTestButton).toBeEnabled());
  fireEvent.click(finishTestButton);

  await waitFor(() => expect(screen.queryByText(translate('test-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('test-results.check-correct-answers')));
  await waitFor(() => expect(screen.queryByText(translate('question-test-answers.loading'))).not.toBeInTheDocument());
}

async function ownTextExercise(translate) {
  expect(screen.getByText(translate('exercise-preparation.text-not-selected'))).toBeInTheDocument();
  expect(screen.getByText(translate('exercise-preparation.text-required'))).toBeInTheDocument();

  fireEvent.click(screen.getByText(translate('exercise-preparation.use-own-text')));

  const text = 'Own reading text';
  fireEvent.paste(document.querySelector('.public-DraftEditor-content'), {
    clipboardData: {
      types: ['text/plain'],
      getData: () => text,
    },
  });

  await waitFor(() => expect(document.querySelector('.public-DraftEditor-content')).toHaveTextContent(text));
  fireEvent.click(screen.getByText(translate('own-text-editor.use')));

  await waitFor(() => expect(screen.queryByText(translate('exercise-preparation.own-text'))).toBeInTheDocument());

  fireEvent.click(screen.getByText(translate('exercise-preparation.proceed')));

  const finishButton = screen.getByLabelText(translate('timing.stop'));
  await waitFor(() => expect(finishButton).toBeEnabled());
  fireEvent.click(finishButton);

  await waitFor(() => expect(screen.queryByText(translate('text-exercise-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('text-exercise-results.proceed')));

  expect(screen.getByText(translate('text-exercise-blank-test.title'))).toBeInTheDocument();
  expect(screen.getByText(translate('text-exercise-blank-test.description'))).toBeInTheDocument();
  const startTestButton = screen.getByText(translate('text-exercise-question-test.start-test'));
  await waitFor(() => expect(startTestButton).toBeEnabled());
  fireEvent.click(startTestButton);

  await waitFor(() => expect(screen.queryByText('1. Own text')).toBeInTheDocument());
  fireEvent.change(screen.getByPlaceholderText('...'), { target: { value: 'reading' } });

  const finishTestButton = screen.getByText(translate('text-exercise-blank-test.finish-test'));
  await waitFor(() => expect(finishTestButton).toBeEnabled());
  fireEvent.click(finishTestButton);

  await waitFor(() => expect(screen.queryByText(translate('test-results.modal-header'))).toBeInTheDocument());
  fireEvent.click(screen.getByText(translate('test-results.check-correct-answers')));
  await waitFor(() => expect(screen.queryByText(translate('blank-test-answers.loading'))).not.toBeInTheDocument());
}

test('shows reading test exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingTest" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-readingTest'));
  expect(screen.getByText(translate('exercises.description-readingTest'))).toBeInTheDocument();
});

test('existing text can be used for reading test exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingTest" />);
  await existingTextExercise(translate);
});

test('own text can be used for reading test exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingTest" />);
  await ownTextExercise(translate);
});

test('shows reading aid exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingAid" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-readingAid'));
  expect(screen.getByText(translate('exercises.description-readingAid'))).toBeInTheDocument();
});

test('existing text can be used for reading aid exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingAid" />);
  await existingTextExercise(translate);
});

test('own text can be used for reading aid exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="readingAid" />);
  await ownTextExercise(translate);
});

test('shows scrolling exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="scrolling" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-scrolling'));
  expect(screen.getByText(translate('exercises.description-scrolling'))).toBeInTheDocument();
});

test('existing text can be used for scrolling exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="scrolling" />);
  await existingTextExercise(translate);
});

test('own text can be used for scrolling exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="scrolling" />);
  await ownTextExercise(translate);
});

test('shows disappearing exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="disappearing" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-disappearing'));
  expect(screen.getByText(translate('exercises.description-disappearing'))).toBeInTheDocument();
});

test('existing text can be used for disappearing exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="disappearing" />);
  await existingTextExercise(translate);
});

test('own text can be used for disappearing exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="disappearing" />);
  await ownTextExercise(translate);
});

test('shows word groups exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="wordGroups" />);
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(translate('exercises.title-wordGroups'));
  expect(screen.getByText(translate('exercises.description-wordGroups'))).toBeInTheDocument();
});

test('existing text can be used for word groups exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="wordGroups" />);
  await existingTextExercise(translate);
});

test('own text can be used for word groups exercise', async () => {
  const { translate } = renderWithRedux(<TextExerciseContainer type="wordGroups" />);
  await ownTextExercise(translate);
});
