import { fireEvent } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../../utils/testUtils';
import TextExercisePreview from './TextExercisePreview';

it('opens and closes the exercise preview', () => {
  const { translate, getByText, baseElement } = renderWithRedux(
    <TextExercisePreview type="readingTest" onProceed={jest.fn()} />,
  );

  expect(baseElement.querySelector('canvas')).toBeNull();
  fireEvent.click(getByText(translate('text-exercise-preview.show')));
  expect(baseElement.querySelector('canvas')).not.toBeNull();
  fireEvent.click(getByText(translate('text-exercise-preview.hide')));
  expect(baseElement.querySelector('canvas')).toBeNull();
});
