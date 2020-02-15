import { render } from '@testing-library/react';
import React from 'react';
import LabeledSlider from './LabeledSlider';

it('formats values', () => {
  const onChange = jest.fn();
  const formatValues = jest.fn();
  render(
    <LabeledSlider snap color="blue" min={1} max={100} values={[50]} onChange={onChange} formatValues={formatValues} />,
  );
  expect(formatValues).toBeCalledTimes(1);
  expect(formatValues).toBeCalledWith([50]);
});
