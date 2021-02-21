import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import TextExercisePreview from './TextExercisePreview';

test('opens and closes the exercise preview', () => {
  const { translate, baseElement } = renderWithRedux(<TextExercisePreview type="readingTest" onProceed={jest.fn()} />);

  expect(baseElement.querySelector('canvas')).not.toBeNull();
  fireEvent.click(screen.getByText(translate('text-exercise-preview.hide')));
  expect(baseElement.querySelector('canvas')).toBeNull();
  fireEvent.click(screen.getByText(translate('text-exercise-preview.show')));
  expect(baseElement.querySelector('canvas')).not.toBeNull();
});
