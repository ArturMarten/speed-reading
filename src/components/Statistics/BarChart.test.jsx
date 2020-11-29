import { render } from '@testing-library/react';
import React from 'react';
import BarChart from './BarChart';

it('draws bar chart svg with rects', () => {
  const { container, getByText } = render(
    <BarChart
      title="Bar Chart title"
      xLabel="X Label"
      yLabel="Y Label"
      fill="blue"
      width={700}
      height={250}
      data={[
        { id: 0, x: 1, y: 1 },
        { id: 1, x: 2, y: 3 },
        { id: 2, x: 3, y: 2 },
      ]}
    />,
  );
  const svg = container.querySelector('svg');
  expect(svg.getAttribute('width')).toEqual('700');
  expect(svg.getAttribute('height')).toEqual('250');
  expect(getByText('Bar Chart title')).toBeInTheDocument();
  expect(getByText('X Label')).toBeInTheDocument();
  expect(getByText('Y Label')).toBeInTheDocument();
  expect(container.querySelectorAll('rect').length).toEqual(3);
});
