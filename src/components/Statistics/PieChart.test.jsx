import { render } from '@testing-library/react';
import React from 'react';
import PieChart from './PieChart';

test('draws pie chart svg', () => {
  const { container, getByText } = render(
    <PieChart
      title="Pie Chart title"
      width={700}
      height={250}
      data={[
        { id: 0, x: 'test1', y: 1 },
        { id: 1, x: 'test2', y: 2 },
        { id: 2, x: 'test3', y: 3 },
      ]}
    />,
  );
  const svg = container.querySelector('svg');
  expect(svg.getAttribute('width')).toEqual('680');
  expect(svg.getAttribute('height')).toEqual('210');
  expect(getByText('Pie Chart title')).toBeInTheDocument();
  expect(container.querySelectorAll('g.arc').length).toEqual(3);
  expect(getByText('test1 (17%)')).toBeInTheDocument();
  expect(getByText('test2 (33%)')).toBeInTheDocument();
  expect(getByText('test3 (50%)')).toBeInTheDocument();
});
