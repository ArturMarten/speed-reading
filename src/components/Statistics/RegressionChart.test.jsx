import React from 'react';

import RegressionChart from './RegressionChart';
import renderWithRedux from '../../utils/testUtils';

it('draws regression chart', () => {
  const { container, getByText } = renderWithRedux(
    <RegressionChart
      title="Regression Chart title"
      width={1000}
      height={400}
      xField="x"
      xLabel="X Label"
      yFields={['y']}
      yLabel="Y Label"
      data={[{ id: 0, x: 1, y: 1 }, { id: 1, x: 2, y: 3 }, { id: 2, x: 3, y: 2 }]}
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
  expect(getByText(translate('regression-chart.no-data'))).toBeInTheDocument();
});
