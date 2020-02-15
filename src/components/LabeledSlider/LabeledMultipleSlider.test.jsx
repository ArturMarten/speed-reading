import { render } from '@testing-library/react';
import React from 'react';
import LabeledMultipleSlider from './LabeledMultipleSlider';

it('formats values', () => {
  const onChange = jest.fn();
  const formatValues = jest.fn();
  render(
    <LabeledMultipleSlider
      snap
      color="blue"
      min={1}
      max={100}
      values={[25, 75]}
      onChange={onChange}
      formatValues={formatValues}
    />,
  );
  expect(formatValues).toBeCalledTimes(1);
  expect(formatValues).toBeCalledWith([25, 75]);
});
