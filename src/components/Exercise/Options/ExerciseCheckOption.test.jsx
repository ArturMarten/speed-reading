import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import ExerciseCheckOption from './ExerciseCheckOption';

it('calls function on change', async () => {
  const updateValue = jest.fn();
  const { container } = render(
    <table>
      <tbody>
        <ExerciseCheckOption name="OptionName" value={false} updateValue={updateValue} />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');
  fireEvent.click(input);
  expect(input.value).toEqual('');
});
