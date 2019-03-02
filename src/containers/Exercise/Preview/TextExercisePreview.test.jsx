import React from 'react';
import { fireEvent } from 'react-testing-library';

import TextExercisePreview from './TextExercisePreview';
import renderWithRedux from '../../../utils/testUtils';

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
