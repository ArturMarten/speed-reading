import { wait } from '@testing-library/react';
import React from 'react';
import renderWithRedux from '../../utils/testUtils';
import RegressionChart from './RegressionChart';

const exampleData = [{ id: 0, x: 1, y: 1 }, { id: 1, x: 2, y: 3 }, { id: 2, x: 3, y: 2 }];

it('draws regression chart', () => {
  const { translate, container, getByText } = renderWithRedux(
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
  expect(svg.getAttribute('width')).toEqual('1000');
  expect(svg.getAttribute('height')).toEqual('400');
  expect(getByText('Regression Chart title')).toBeInTheDocument();
  const legend = container.querySelector('g.legend');
  expect(legend).toHaveTextContent('Legend [muutus: +1 (+66.67%), keskmine: 2.00, standardhälve: 0.82]');
  expect(getByText('X Label')).toBeInTheDocument();
  expect(getByText('Y Label')).toBeInTheDocument();
  expect(getByText(translate('regression-chart.no-data')).style.opacity).toEqual('0');
});

it('shows message when no data', () => {
  const { translate, getByText } = renderWithRedux(
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
  expect(getByText(translate('regression-chart.no-data')).style.opacity).toEqual('1');
});

it('updates regression chart', async () => {
  const { translate, getByText, container, rerender } = renderWithRedux(
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
  const noDataElement = getByText(translate('regression-chart.no-data'));
  expect(noDataElement.style.opacity).toEqual('1');
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
  await wait(() => expect(noDataElement.style.opacity).toEqual('0'));
  expect(legend).toHaveTextContent('Legend [muutus: +1 (+66.67%), keskmine: 2.00, standardhälve: 0.82]');
});
