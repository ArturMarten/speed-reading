import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition';
import { select } from 'd3-selection';
import { line } from 'd3-shape';

import './RegressionChart.css';
import { leastSquares, getAverage, getStandardDeviation } from '../../shared/utility';

const margin = {
  top: 50,
  right: 30,
  bottom: 20,
  left: 50,
};

const DATA_POINT_RADIUS = 4;
const TRANSITION_DURATION = 2000;
const FONT_SIZE = 12;
const HORIZONTAL_SPACING = 0.05;
const VERTICAL_SPACING = 0.05;

export class RegressionChart extends Component {
  state = {
    width: this.props.width - margin.left - margin.right,
    height: this.props.height - margin.top - margin.bottom,
    widthScaleType: 'time',
    widthScale: scaleTime()
      .range([0, this.props.width - margin.left - margin.right]),
    heightScale: scaleLinear()
      .range([0, this.props.height - margin.top - margin.bottom]),
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { widthScale } = prevState;
    const { data } = nextProps;

    const width = nextProps.width - margin.left - margin.right;
    if (data.length > 0) {
      if (data[0][nextProps.xField] instanceof Date) {
        widthScale = scaleTime().range([0, width]);
      } else {
        widthScale = scaleLinear().range([0, width]);
      }
    }

    return {
      ...prevState,
      widthScale,
    };
  }

  componentDidMount() {
    const {
      width,
      height,
      widthScale,
      heightScale,
    } = this.state;
    let { data } = this.props;
    const { xField, yFields } = this.props;

    data = data.filter(d => d[xField] !== null && d[yFields[0]] !== null);
    // console.log(data);
    const xValues = data.map(d => d[xField]);
    const yValues = data.map(d => d[yFields[0]]);
    const minXValue = Math.min(...xValues);
    const maxXValue = Math.max(...xValues);
    const maxYValue = Math.max(...yValues);
    const linePoints = Number.isFinite(minXValue) && Number.isFinite(maxXValue) ? [[minXValue, maxXValue]] : [];
    const horizontalSpacing = (maxXValue - minXValue) * HORIZONTAL_SPACING || 1;
    const verticalSpacing = maxYValue * VERTICAL_SPACING;
    if (data[0] && data[0][xField] instanceof Date) {
      this.xScale = widthScale.domain([new Date(minXValue - horizontalSpacing), new Date(maxXValue + horizontalSpacing)]);
    } else {
      this.xScale = widthScale.domain([minXValue - horizontalSpacing, maxXValue + horizontalSpacing]);
    }
    this.yScale = heightScale.domain([maxYValue + verticalSpacing, -verticalSpacing]);
    const xSeries = xValues.map(d => this.xScale(d));
    const ySeries = yValues.map(d => this.yScale(d));
    const [slope, intercept] = leastSquares(xSeries, ySeries);

    const initial = this.yScale.invert(intercept + (slope * this.xScale(minXValue)));
    const end = this.yScale.invert(intercept + (slope * this.xScale(maxXValue)));
    const change = end - initial || 0;
    const changePercentage = initial > 0 ? (change / initial) * 100 : 0;
    const average = getAverage(yValues) || 0;
    const standardDeviation = getStandardDeviation(yValues, average) || 0;

    const svg = select(this.svgRef);
    const chart = svg.append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Append title
    svg.append('text')
      .attr('class', 'title')
      .style('font-size', FONT_SIZE + 5)
      .style('font-weight', 'bold')
      .attr('transform', `translate(${margin.left - 10}, ${FONT_SIZE + 3})`)
      .text(this.props.title);

    // Append no data message
    svg.append('text')
      .attr('class', 'no-data')
      .attr('dy', '-.7em')
      .style('opacity', data.length === 0 ? 1 : 0)
      .style('text-anchor', 'middle')
      .attr('x', margin.left + width / 2)
      .attr('y', margin.top + height / 2)
      .text(this.props.translate('regression-chart.no-data'));

    // Append axis
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .style('font-size', FONT_SIZE)
      .call(
        data[0] && data[0][this.props.xField] instanceof Date ?
          axisBottom(this.xScale).tickFormat(timeFormat('%d/%m')).tickSizeInner(-height)
          : axisBottom(this.xScale).tickSizeInner(-height),
      )
      .append('text')
      .attr('class', 'label')
      .attr('y', -2)
      .attr('x', width)
      .text(this.props.xLabel);
    chart.append('g')
      .attr('class', 'y-axis')
      .style('font-size', FONT_SIZE)
      .call(axisLeft(this.yScale).ticks(10).tickSizeInner(-width))
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', FONT_SIZE)
      .text(this.props.yLabel);

    // Append legend label
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width * 0.4}, ${FONT_SIZE})`);
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', this.props.dataLineColor[0]);
    const legendText = legend.append('text')
      .attr('x', 20)
      .attr('y', 10);
    legendText.append('tspan')
      .text(`${this.props.legendTitles[0]} [${this.props.translate('regression-chart.change')}: `);
    legendText.append('tspan')
      .attr('class', 'change')
      .style('fill', change >= 0 ? 'green' : 'red')
      .text(`${change > 0 ? '+' : ''}${change.toFixed(0)}`);
    legendText.append('tspan')
      .text(' (');
    legendText.append('tspan')
      .attr('class', 'changePercentage')
      .style('fill', changePercentage >= 0 ? 'green' : 'red')
      .text(`${changePercentage > 0 ? '+' : ''}${changePercentage.toFixed(2)}%`);
    legendText.append('tspan')
      .text(`), ${this.props.translate('regression-chart.average')}: `);
    legendText.append('tspan')
      .attr('class', 'average')
      .text(`${average.toFixed(2)}`);
    legendText.append('tspan')
      .text(`, ${this.props.translate('regression-chart.standard-deviation')}: `);
    legendText.append('tspan')
      .attr('class', 'standard-deviation')
      .text(`${standardDeviation.toFixed(2)}`);
    legendText.append('tspan')
      .text(']');

    // Append tooltip
    const tooltip = chart.append('g')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden');

    const tooltipLabel = tooltip.append('text');

    // Append datapoints
    this.props.yFields.forEach((yField, index) => {
      chart.append('g')
        .selectAll('.data-point')
        .data(data, d => d.id)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => this.xScale(d[xField]))
        .attr('cy', d => this.yScale(d[yField]))
        .attr('r', DATA_POINT_RADIUS)
        .style('fill', this.props.dataFillColor[index])
        .style('stroke', this.props.dataStrokeColor[index])
        .on('mouseover', (d) => {
          const x = this.xScale(d[xField]);
          const y = this.yScale(d[yField]);
          tooltip.style('visibility', 'visible')
            .attr('transform', `translate(${x}, ${y})`);
          tooltipLabel.text(`ID: ${d.id}`);
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });
    });

    // Append regression line
    const newLine = line()
      .x(d => this.xScale(d))
      .y(d => intercept + (slope * this.xScale(d)));

    chart.append('path')
      .attr('class', 'regression-line')
      .style('stroke', this.props.dataLineColor[0])
      .data(linePoints)
      .attr('d', newLine);
  }

  componentDidUpdate(prevProps) {
    const {
      width,
      height,
    } = this.state;
    let { data } = this.props;
    const {
      translate,
      xLabel,
      xField,
      yFields,
    } = this.props;
    const { widthScale, heightScale } = this.state;
    const svg = select(this.svgRef);
    const chart = svg.select('g');
    if (prevProps.xField !== xField) {
      chart.select('.x-axis .label')
        .transition()
        .duration(TRANSITION_DURATION)
        .text(xLabel);
    }
    if (prevProps.translate !== translate) {
      // console.log('Translate changed');
    }
    // console.log('Regression chart update');
    // Move data from render method to parent state
    if (prevProps.data !== data) {
      data = data.filter(d => d[xField] !== null && d[yFields[0]] !== null);
      // Update scales
      const xValues = data.map(d => d[xField]);
      const yValues = data.map(d => d[yFields[0]]);
      const minXValue = Math.min(...xValues);
      const maxXValue = Math.max(...xValues);
      const maxYValue = Math.max(...yValues);
      const linePoints = Number.isFinite(minXValue) && Number.isFinite(maxXValue) ? [[minXValue, maxXValue]] : [];
      const horizontalSpacing = (maxXValue - minXValue) * HORIZONTAL_SPACING || 1;
      const verticalSpacing = maxYValue * VERTICAL_SPACING;
      if (data[0] && data[0][xField] instanceof Date) {
        this.xScale = widthScale.domain([new Date(minXValue - horizontalSpacing), new Date(maxXValue + horizontalSpacing)]);
      } else {
        this.xScale = widthScale.domain([minXValue - horizontalSpacing, maxXValue + horizontalSpacing]);
      }
      this.yScale = heightScale.domain([maxYValue + verticalSpacing, -verticalSpacing]);
      const xSeries = xValues.map(d => this.xScale(d));
      const ySeries = yValues.map(d => this.yScale(d));
      const [slope, intercept] = leastSquares(xSeries, ySeries);
      const initial = this.yScale.invert(intercept + (slope * this.xScale(minXValue)));
      const end = this.yScale.invert(intercept + (slope * this.xScale(maxXValue)));
      const change = end - initial || 0;
      const changePercentage = initial > 0 ? (change / initial) * 100 : 0;
      const average = getAverage(yValues) || 0;
      const standardDeviation = getStandardDeviation(yValues, average) || 0;

      // Update no data message
      svg.select('.no-data')
        .transition()
        .duration(TRANSITION_DURATION / 2)
        .style('opacity', data.length === 0 ? 1 : 0);

      // Update axis
      if (data[0] && data[0][this.props.xField] instanceof Date) {
        chart.select('.x-axis')
          .transition()
          .duration(TRANSITION_DURATION)
          .call(axisBottom(this.xScale).tickFormat(timeFormat('%d/%m')).tickSizeInner(-height));
      } else {
        chart.select('.x-axis')
          .transition()
          .duration(TRANSITION_DURATION)
          .call(axisBottom(this.xScale).tickSizeInner(-height));
      }

      chart.select('.y-axis')
        .transition()
        .duration(TRANSITION_DURATION)
        .call(axisLeft(this.yScale).ticks(10).tickSizeInner(-width));

      // Update legend
      svg.select('.change')
        .transition()
        .duration(TRANSITION_DURATION)
        .style('fill', change >= 0 ? 'green' : 'red')
        .text(`${change > 0 ? '+' : ''}${change.toFixed(0)}`);
      svg.select('.changePercentage')
        .transition()
        .duration(TRANSITION_DURATION)
        .style('fill', changePercentage >= 0 ? 'green' : 'red')
        .text(`${changePercentage > 0 ? '+' : ''}${changePercentage.toFixed(2)}%`);
      svg.select('.average')
        .transition()
        .duration(TRANSITION_DURATION)
        .text(`${average.toFixed(2)}`);
      svg.select('.standard-deviation')
        .transition()
        .duration(TRANSITION_DURATION)
        .text(`${standardDeviation.toFixed(2)}`);

      yFields.forEach((yField, index) => {
        const dataPoints = chart.selectAll('.data-point').data(data);
        // Remove old datapoints
        dataPoints
          .exit()
          .transition()
          .duration(TRANSITION_DURATION / 2)
          .style('opacity', 0)
          .remove();
        // Update existing datapoints
        dataPoints
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('cx', d => this.xScale(d[xField]))
          .attr('cy', d => this.yScale(d[yField]))
          .style('fill', this.props.dataFillColor[index])
          .style('stroke', this.props.dataStrokeColor[index])
          .style('opacity', 1);
        // Add new datapoints
        dataPoints
          .enter()
          .append('circle')
          .attr('class', 'data-point')
          .style('opacity', 0)
          .style('stroke', this.props.dataStrokeColor[index])
          .style('fill', this.props.dataFillColor[index])
          .attr('cx', d => this.xScale(d[xField]))
          .attr('cy', d => this.yScale(d[yField]))
          .attr('r', DATA_POINT_RADIUS)
          .transition()
          .duration(TRANSITION_DURATION / 2)
          .style('opacity', 1);
      });

      // Update regression line
      const newLine = line()
        .x(d => this.xScale(d))
        .y(d => intercept + (slope * this.xScale(d)));
      const regressionLine = chart.selectAll('.regression-line').data(linePoints);
      regressionLine
        .enter()
        .append('path')
        .attr('class', 'regression-line')
        .style('opacity', 0)
        .style('stroke', this.props.dataLineColor[0])
        .attr('d', newLine)
        .transition()
        .duration(TRANSITION_DURATION / 2)
        .style('opacity', 1);
      regressionLine
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('d', newLine)
        .style('opacity', 1)
        .style('stroke', this.props.dataLineColor[0]);
      regressionLine
        .exit()
        .transition()
        .duration(TRANSITION_DURATION / 2)
        .style('opacity', 0)
        .remove();
    } else {
      // console.log('Props changed');
    }
  }

  render() {
    return (
      <svg
        ref={(svg) => { this.svgRef = svg; }}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}

RegressionChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  xField: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataStrokeColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataFillColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataLineColor: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RegressionChart;
