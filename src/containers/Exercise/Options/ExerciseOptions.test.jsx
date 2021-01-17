import React from 'react';
import renderWithRedux from '../../../utils/testUtils';

import ExerciseOptions from './ExerciseOptions';

test('renders default options', () => {
  renderWithRedux(
    <table>
      <tbody>
        <ExerciseOptions />
      </tbody>
    </table>,
  );
});
