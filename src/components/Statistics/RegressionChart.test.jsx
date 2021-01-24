import { waitFor, screen } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import RegressionChart from './RegressionChart';

const exampleData = [
  { id: 0, x: 1, y: 1 },
  { id: 1, x: 2, y: 3 },
  { id: 2, x: 3, y: 2 },
];

test('draws regression chart', () => {
  const { translate, container } = renderWithRedux(
    <RegressionChart
      title="Regression Chart title"
      width={1000}
      height={400}
      xField="x"
      xLabel="X Label"
      yFields={['y']}
      yLabel="Y Label"
      data={exampleData}
      dataFillColor={['#FF9999']}
      dataLineColor={['#FF0000']}
      dataStrokeColor={['#FF4C4C']}
      legendTitles={['Legend']}
      order={1}
    />,
    { useTranslate: true },
  );
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('width', '1000');
  expect(svg).toHaveAttribute('height', '400');
  expect(screen.getByText('Regression Chart title')).toBeInTheDocument();
  const legend = container.querySelector('g.legend');
  expect(legend).toHaveTextContent('Legend [muutus: +1 (+66.67%), keskmine: 2.00, standardhälve: 0.82]');
  expect(screen.getByText('X Label')).toBeInTheDocument();
  expect(screen.getByText('Y Label')).toBeInTheDocument();
  expect(screen.getByText(translate('regression-chart.no-data')).style.opacity.charAt(0)).toEqual('0');
});

test('shows message when no data', () => {
  const { translate } = renderWithRedux(
    <RegressionChart
      title="Regression Chart title"
      width={1000}
      height={400}
      xField=""
      xLabel=""
      yFields={['']}
      yLabel=""
      data={[]}
      dataFillColor={['#FF9999']}
      dataLineColor={['#FF0000']}
      dataStrokeColor={['#FF4C4C']}
      legendTitles={['Legend']}
      order={1}
    />,
    { useTranslate: true },
  );
  expect(screen.getByText(translate('regression-chart.no-data')).style.opacity.charAt(0)).toEqual('1');
});

test('updates regression chart', async () => {
  const { translate, container, rerender } = renderWithRedux(
    <RegressionChart
      title="Regression Chart title"
      width={1000}
      height={400}
      xField="x"
      xLabel="X Label"
      yFields={['y']}
      yLabel="Y Label"
      data={[]}
      dataFillColor={['#FF9999']}
      dataLineColor={['#FF0000']}
      dataStrokeColor={['#FF4C4C']}
      legendTitles={['Legend']}
      order={1}
    />,
    { useTranslate: true },
  );
  const noDataElement = screen.getByText(translate('regression-chart.no-data'));
  expect(noDataElement.style.opacity.charAt(0)).toEqual('1');
  rerender(
    <RegressionChart
      title="Regression Chart title"
      width={1000}
      height={400}
      xField="x"
      xLabel="X Label"
      yFields={['y']}
      yLabel="Y Label"
      data={exampleData}
      dataFillColor={['#FF9999']}
      dataLineColor={['#FF0000']}
      dataStrokeColor={['#FF4C4C']}
      legendTitles={['Legend']}
      order={1}
    />,
  );
  const legend = container.querySelector('g.legend');
  await waitFor(() => expect(noDataElement.style.opacity.charAt(0)).toEqual('0'));
  expect(legend).toHaveTextContent('Legend [muutus: +1 (+66.67%), keskmine: 2.00, standardhälve: 0.82]');
});
