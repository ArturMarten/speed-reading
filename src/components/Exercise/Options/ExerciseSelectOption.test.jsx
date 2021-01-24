import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ExerciseSelectOption from './ExerciseSelectOption';

const optionName = 'OptionName';
const options = [
  { key: 0, value: 'Option1', text: 'Option1' },
  { key: 1, value: 'Option2', text: 'Option2' },
];
const updateValue = jest.fn();
const defaultProps = {
  name: optionName,
  value: 'Option1',
  options,
  updateValue,
};

afterEach(() => {
  updateValue.mockReset();
});

test('updates value on change', () => {
  const { rerender } = render(
    <table>
      <tbody>
        <ExerciseSelectOption {...defaultProps} />
      </tbody>
    </table>,
  );
  expect(screen.getByText(optionName)).toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveTextContent('Option1');

  rerender(
    <table>
      <tbody>
        <ExerciseSelectOption {...defaultProps} value="Option2" />
      </tbody>
    </table>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Option2');
  expect(updateValue).toHaveBeenCalledTimes(0);
});

test('calls function on change', () => {
  render(
    <table>
      <tbody>
        <ExerciseSelectOption {...defaultProps} />
      </tbody>
    </table>,
  );

  fireEvent.click(screen.getAllByText('Option1')[0]);
  fireEvent.click(screen.getByText('Option2'));
  expect(screen.getByRole('alert')).toHaveTextContent('Option2');
  expect(updateValue).toHaveBeenCalledTimes(1);
  expect(updateValue).toHaveBeenCalledWith('Option2');
  updateValue.mockReset();

  fireEvent.click(screen.getByText('Option1'));
  expect(screen.getByRole('alert')).toHaveTextContent('Option1');
  expect(updateValue).toHaveBeenCalledTimes(1);
  expect(updateValue).toHaveBeenCalledWith('Option1');
  updateValue.mockReset();
});
