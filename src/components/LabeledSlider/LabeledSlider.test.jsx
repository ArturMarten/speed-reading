import { render } from '@testing-library/react';
import React from 'react';
import LabeledSlider from './LabeledSlider';

test('formats value', () => {
  const onChange = jest.fn();
  const formatValue = jest.fn();
  render(<LabeledSlider color="blue" min={1} max={100} value={50} onChange={onChange} formatValue={formatValue} />);
  expect(formatValue).toBeCalledTimes(1);
  expect(formatValue).toBeCalledWith(50);
});
