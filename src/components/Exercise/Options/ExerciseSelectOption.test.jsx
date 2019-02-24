import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import ExerciseSelectOption from './ExerciseSelectOption';

it('calls function on change', async () => {
  const updateValue = jest.fn();
  const { getByText } = render(
    <table>
      <tbody>
        <ExerciseSelectOption
          name="OptionName"
          value="Option1"
          options={[{ key: 0, value: 'Option1', text: 'Option1' }, { key: 1, value: 'Option2', text: 'Option2' }]}
          updateValue={updateValue}
        />
      </tbody>
    </table>,
  );
  fireEvent.click(getByText('Option1'));
  fireEvent.click(getByText('Option2'));
  expect(updateValue).toHaveBeenCalledTimes(1);
  expect(updateValue).toHaveBeenCalledWith('Option2');
});
