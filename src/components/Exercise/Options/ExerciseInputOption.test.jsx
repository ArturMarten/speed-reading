import React from 'react';
import { fireEvent, wait } from 'react-testing-library';
import renderWithRedux from '../../../utils/testUtils';

import ExerciseInputOption from './ExerciseInputOption';

it('calls function on change', async () => {
  const updateValue = jest.fn();
  const { baseElement } = renderWithRedux(
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
  const plusButton = baseElement.querySelector('button i.plus.icon');
  const minusButton = baseElement.querySelector('button i.minus.icon');
  const input = baseElement.querySelector('input');
  fireEvent.click(plusButton);
  expect(input.value).toEqual('100');
  fireEvent.click(minusButton);
  expect(input.value).toEqual('95');
  fireEvent.click(minusButton);
  expect(input.value).toEqual('90');
  await wait(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenNthCalledWith(1, 90);
  fireEvent.click(plusButton);
  expect(input.value).toEqual('95');
  await wait(() => expect(updateValue).toHaveBeenCalledTimes(2));
  expect(updateValue).toHaveBeenNthCalledWith(2, 95);
});
