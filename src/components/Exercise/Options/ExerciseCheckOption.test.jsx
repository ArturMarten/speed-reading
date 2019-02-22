import React from 'react';
import { fireEvent } from 'react-testing-library';
import renderWithRedux from '../../../utils/testUtils';

import ExerciseCheckOption from './ExerciseCheckOption';

it('calls function on change', async () => {
  const updateValue = jest.fn();
  const { baseElement } = renderWithRedux(
    <table>
      <tbody>
        <ExerciseCheckOption name="OptionName" value={false} updateValue={updateValue} />
      </tbody>
    </table>,
  );
  const input = baseElement.querySelector('input');
  fireEvent.click(input);
  expect(input.value).toEqual('');
});
