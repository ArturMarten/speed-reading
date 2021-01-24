import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ExerciseCheckOption from './ExerciseCheckOption';

const optionName = 'OptionName';
const updateValue = jest.fn();
const defaultProps = {
  name: optionName,
  value: false,
  updateValue,
};

afterEach(() => {
  updateValue.mockReset();
});

test('updates value on change', () => {
  const { container, rerender } = render(
    <table>
      <tbody>
        <ExerciseCheckOption {...defaultProps} />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');
  expect(screen.getByText(optionName)).toBeInTheDocument();
  expect(input.checked).toEqual(false);

  rerender(
    <table>
      <tbody>
        <ExerciseCheckOption {...defaultProps} value={true} />
      </tbody>
    </table>,
  );

  expect(input.checked).toEqual(true);
  expect(updateValue).toHaveBeenCalledTimes(0);
});

test('calls function on change', () => {
  const { container } = render(
    <table>
      <tbody>
        <ExerciseCheckOption {...defaultProps} />
      </tbody>
    </table>,
  );
  const input = container.querySelector('input');

  fireEvent.click(input);
  expect(input.checked).toEqual(true);
  expect(updateValue).toHaveBeenCalledTimes(1);
  expect(updateValue).toHaveBeenCalledWith(true);
  updateValue.mockReset();

  fireEvent.click(input);
  expect(input.checked).toEqual(false);
  expect(updateValue).toHaveBeenCalledTimes(1);
  expect(updateValue).toHaveBeenCalledWith(false);
});
