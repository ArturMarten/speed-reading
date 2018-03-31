import React, { Component } from 'react';
import c3 from 'c3';
import 'c3/c3.min.css';

function leastSquares(xSeries, ySeries) {
  const reduceSumFunc = (prev, cur) => prev + cur;
  const xBar = (xSeries.reduce(reduceSumFunc) * 1.0) / xSeries.length;
  const yBar = (ySeries.reduce(reduceSumFunc) * 1.0) / ySeries.length;

  const ssXX = xSeries.map(d => (d - xBar) ** 2).reduce(reduceSumFunc);

  const ssYY = ySeries.map(d => (d - yBar) ** 2).reduce(reduceSumFunc);

  const ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar)).reduce(reduceSumFunc);

  const slope = ssXY / ssXX;
  const intercept = yBar - (xBar * slope);
  const rSquare = (ssXY ** 2) / (ssXX * ssYY);

  return [slope, intercept, rSquare];
}

export class RegressionChartC3 extends Component {
  componentDidMount() {
    this.chart = c3.generate({
      bindto: '#chart',
      size: {
        height: 500,
      },
      point: {
        r: 4,
      },
      data: {
        x: 'date',
        rows: [],
        type: 'scatter',
      },
      axis: {
        x: {
          type: 'timeseries',
          label: this.props.translate('statistics.date'),
          tick: {
            format: '%Y-%m-%d %H:%M',
            count: 6,
          },
        },
        y: {
          label: this.props.translate('statistics.wpm'),
        },
      },
      zoom: {
        enabled: true,
        rescale: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        show: true,
      },
    });
  }

  componentDidUpdate() {
    this.chart.load({
      unload: true,
      rows: [
        ['date', 'wpm'],
        ...this.props.data.map(row => [row.date, row.wpm]),
      ],
    });
  }

  render() {
    return (
      <div id="chart" />
    );
  }
}

export default RegressionChartC3;
