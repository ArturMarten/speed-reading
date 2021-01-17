import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import ExerciseInputOption from './ExerciseInputOption';

test('calls function on change', async () => {
  const updateValue = jest.fn();
  const { container } = render(
    <table>
      <tbody>
        <ExerciseInputOption
          name="OptionName"
          unit="OptionUnit"
          value={100}
          min={0}
          max={100}
          step={5}
          updateValue={updateValue}
        />
      </tbody>
    </table>,
  );
  const plusButton = container.querySelector('button i.plus.icon');
  const minusButton = container.querySelector('button i.minus.icon');
  const input = container.querySelector('input');
  fireEvent.click(plusButton);
  expect(input.value).toEqual('100');
  fireEvent.click(minusButton);
  expect(input.value).toEqual('95');
  fireEvent.click(minusButton);
  expect(input.value).toEqual('90');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenNthCalledWith(1, 90);
  fireEvent.click(plusButton);
  expect(input.value).toEqual('95');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(2));
  expect(updateValue).toHaveBeenNthCalledWith(2, 95);
});
