import React, { Component } from 'react';
import c3 from 'c3';
import 'c3/c3.min.css';

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
          label: this.props.translate('regression-chart.date'),
          tick: {
            format: '%Y-%m-%d %H:%M',
            count: 6,
          },
        },
        y: {
          label: this.props.translate('regression-chart.wpm'),
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
