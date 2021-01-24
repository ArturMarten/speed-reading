import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ExerciseInputOption from './ExerciseInputOption';

const optionName = 'OptionName';
const optionUnit = 'OptionUnit';
const updateValue = jest.fn();
const defaultProps = {
  name: optionName,
  unit: optionUnit,
  value: 100,
  min: 0,
  max: 100,
  step: 5,
  updateValue,
  updateDelay: 50,
  keyboardChangesEnabled: false,
};

afterEach(() => {
  updateValue.mockReset();
});

test('updates value on change', () => {
  const { container, rerender } = render(
    <table>
      <tbody>
        <ExerciseInputOption {...defaultProps} />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');
  expect(screen.getByText(optionName)).toBeInTheDocument();
  expect(input.value).toEqual('100');
  expect(screen.getByText(optionUnit)).toBeInTheDocument();

  rerender(
    <table>
      <tbody>
        <ExerciseInputOption {...defaultProps} value={50} />
      </tbody>
    </table>,
  );

  expect(input.value).toEqual('50');
  expect(updateValue).toHaveBeenCalledTimes(0);
});

test('calls function on enter and on blur', async () => {
  const { container } = render(
    <table>
      <tbody>
        <ExerciseInputOption {...defaultProps} />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');
  const enterKeyOptions = { key: 'Enter', code: 13, charCode: 13 };

  fireEvent.change(input, { target: { value: '' } });
  expect(input.value).toEqual('0');
  fireEvent.keyPress(input, enterKeyOptions);
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(0);
  updateValue.mockReset();

  fireEvent.change(input, { target: { value: '105' } });
  expect(input.value).toEqual('100');
  fireEvent.change(input, { target: { value: '95' } });
  expect(input.value).toEqual('95');
  fireEvent.keyPress(input, enterKeyOptions);
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(95);
  updateValue.mockReset();

  fireEvent.change(input, { target: { value: '-5' } });
  expect(input.value).toEqual('0');
  fireEvent.blur(input);
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(0);
  updateValue.mockReset();
});

test('calls function on button clicks with delay', async () => {
  const { container } = render(
    <table>
      <tbody>
        <ExerciseInputOption {...defaultProps} />
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
  expect(updateValue).toHaveBeenCalledWith(90);
  updateValue.mockReset();

  fireEvent.click(plusButton);
  expect(input.value).toEqual('95');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(95);
  updateValue.mockReset();

  fireEvent.change(input, { target: { value: '5' } });
  fireEvent.click(minusButton);
  expect(input.value).toEqual('0');
  fireEvent.click(minusButton);
  expect(input.value).toEqual('0');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(0);
  updateValue.mockReset();
});

test('calls function on +/- press with delay', async () => {
  const { container } = render(
    <table>
      <tbody>
        <ExerciseInputOption {...defaultProps} keyboardChangesEnabled />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');
  const plusKeyOptions = { key: '+', code: 43, charCode: 43 };
  const minusKeyOptions = { key: '-', code: 45, charCode: 45 };

  fireEvent.keyPress(document, plusKeyOptions);
  expect(input.value).toEqual('100');
  fireEvent.keyPress(document, minusKeyOptions);
  expect(input.value).toEqual('95');
  fireEvent.keyPress(document, minusKeyOptions);
  expect(input.value).toEqual('90');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(90);
  updateValue.mockReset();

  fireEvent.keyPress(document, plusKeyOptions);
  expect(input.value).toEqual('95');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(95);
  updateValue.mockReset();

  fireEvent.change(input, { target: { value: '5' } });
  fireEvent.keyPress(document, minusKeyOptions);
  expect(input.value).toEqual('0');
  fireEvent.keyPress(document, minusKeyOptions);
  expect(input.value).toEqual('0');
  await waitFor(() => expect(updateValue).toHaveBeenCalledTimes(1));
  expect(updateValue).toHaveBeenCalledWith(0);
  updateValue.mockReset();
});
