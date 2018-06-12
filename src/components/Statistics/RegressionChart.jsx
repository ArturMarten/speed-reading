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
const TRANSITION_DURATION = 1000;
const FONT_SIZE = 12;
const HORIZONTAL_SPACING = 0.1;
const VERTICAL_SPACING = 0.1;

export class RegressionChart extends Component {
  state = {
    width: this.props.width - margin.left - margin.right,
    height: this.props.height - margin.top - margin.bottom,
    widthScale: scaleTime()
      .range([0, this.props.width - margin.left - margin.right]),
    heightScale: scaleLinear()
      .range([0, this.props.height - margin.top - margin.bottom]),
  }

  componentDidMount() {
    const {
      width,
      height,
      widthScale,
      heightScale,
    } = this.state;
    const { data } = this.props;
    if (data.length === 0) {
      return;
    }
    const svg = select(this.svgRef);
    const chart = svg.append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    /*
    if (data[0][this.props.xField] instanceof Date) {
      console.log('Date field passed');
    } else {
      console.log('Number field passed');
    }
    console.log(data);
    */
    const xValues = data.map(d => d.date);
    const yValues = data.map(d => d[this.props.yFields[0]]);
    const minDate = Math.min(...xValues);
    const maxDate = Math.max(...xValues);
    const maxValue = Math.max(...yValues);
    const difference = maxDate - minDate;
    const spacing = difference * HORIZONTAL_SPACING;
    this.xScale = widthScale.domain([new Date(minDate - spacing), new Date(maxDate + spacing)]);
    this.yScale = heightScale.domain([maxValue + (maxValue * VERTICAL_SPACING), 0]);
    const xSeries = data.map(d => this.xScale(d.date));
    const ySeries = data.map(d => this.yScale(d[this.props.yFields[0]]));
    const [slope, intercept] = leastSquares(xSeries, ySeries);
    const change = slope * -100;
    const average = getAverage(yValues);
    const standardDeviation = getStandardDeviation(yValues, average);

    // Append title
    svg.append('text')
      .attr('class', 'title')
      .style('font-size', FONT_SIZE + 5)
      .style('font-weight', 'bold')
      .attr('transform', `translate(${margin.left - 10}, ${FONT_SIZE + 3})`)
      .text(this.props.title);

    // Append axis
    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .style('font-size', FONT_SIZE)
      .call(axisBottom(this.xScale).tickFormat(timeFormat('%d/%m/%y')))
      .append('text')
      .attr('class', 'label')
      .attr('y', -2)
      .attr('x', width)
      .text(this.props.xLabel);
    chart.append('g')
      .attr('class', 'y-axis')
      .style('font-size', FONT_SIZE)
      .call(axisLeft(this.yScale).ticks(10))
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
      .text(`${this.props.legendTitles[0]} (${this.props.translate('regression-chart.change')}: `);
    legendText.append('tspan')
      .attr('class', 'change')
      .style('fill', change >= 0 ? 'green' : 'red')
      .text(`${change > 0 ? '+' : ''}${change.toFixed(2)}%`);
    legendText.append('tspan')
      .text(`, ${this.props.translate('regression-chart.average')}: `);
    legendText.append('tspan')
      .attr('class', 'average')
      .text(`${average.toFixed(2)}`);
    legendText.append('tspan')
      .text(`, ${this.props.translate('regression-chart.standard-deviation')}: `);
    legendText.append('tspan')
      .attr('class', 'standard-deviation')
      .text(`${standardDeviation.toFixed(2)}`);
    legendText.append('tspan')
      .text(')');

    // Append datapoints
    this.props.yFields.forEach((yField, index) => {
      chart.append('g')
        .selectAll(`.data-point-${yField}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `data-point-${yField}`)
        .style('stroke', this.props.dataStrokeColor[index])
        .style('fill', this.props.dataFillColor[index])
        .attr('cx', d => this.xScale(d.date))
        .attr('cy', d => this.yScale(d[yField]))
        .attr('r', DATA_POINT_RADIUS);
    });

    // Append regression line
    const newLine = line()
      .x(d => this.xScale(d))
      .y(d => intercept + (slope * this.xScale(d)));

    chart.append('path')
      .attr('class', 'regression-line')
      .style('stroke', this.props.dataLineColor[0])
      .datum([minDate, maxDate])
      .attr('d', newLine);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    // Move data from render method to parent state
    if (prevProps.data !== data && data.length > 0) {
      const { widthScale, heightScale } = this.state;
      const svg = select(this.svgRef);
      const chart = svg.select('g');
      // Update scales
      const xValues = data.map(d => d.date);
      const yValues = data.map(d => d[this.props.yFields[0]]);
      const minDate = Math.min(...xValues);
      const maxDate = Math.max(...xValues);
      const maxValue = Math.max(...yValues);
      const difference = maxDate - minDate;
      const spacing = difference * HORIZONTAL_SPACING;
      this.xScale = widthScale.domain([new Date(minDate - spacing), new Date(maxDate + spacing)]);
      this.yScale = heightScale.domain([maxValue + (maxValue * VERTICAL_SPACING), 0]);
      const xSeries = data.map(d => this.xScale(d.date));
      const ySeries = data.map(d => this.yScale(d[this.props.yFields[0]]));
      const [slope, intercept] = leastSquares(xSeries, ySeries);
      const change = slope * -100;
      const average = getAverage(yValues);
      const standardDeviation = getStandardDeviation(yValues, average);

      // Update axis
      chart.select('.x-axis')
        .transition()
        .duration(TRANSITION_DURATION)
        .call(axisBottom(this.xScale).tickFormat(timeFormat('%d/%m/%y')));
      chart.select('.y-axis')
        .transition()
        .duration(TRANSITION_DURATION)
        .call(axisLeft(this.yScale).ticks(10));

      // Update legend
      svg.select('.change')
        .transition()
        .duration(TRANSITION_DURATION)
        .style('fill', change >= 0 ? 'green' : 'red')
        .text(`${change > 0 ? '+' : ''}${change.toFixed(2)}%`);
      svg.select('.average')
        .transition()
        .duration(TRANSITION_DURATION)
        .text(`${average.toFixed(2)}`);
      svg.select('.standard-deviation')
        .transition()
        .duration(TRANSITION_DURATION)
        .text(`${standardDeviation.toFixed(2)}`);

      this.props.yFields.forEach((yField, index) => {
        // Remove old datapoints
        chart.selectAll(`.data-point-${yField}`)
          .data(data)
          .exit()
          .remove();
        // Update existing datapoints
        chart.selectAll(`.data-point-${yField}`)
          .data(data)
          .transition()
          .duration(TRANSITION_DURATION)
          .attr('cx', d => this.xScale(d.date))
          .attr('cy', d => this.yScale(d[yField]));
        // Add new datapoints
        chart.selectAll(`.data-point-${yField}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('class', `data-point-${yField}`)
          .style('stroke', this.props.dataStrokeColor[index])
          .style('fill', this.props.dataFillColor[index])
          .attr('cx', d => this.xScale(d.date))
          .attr('cy', d => this.yScale(d[yField]))
          .attr('r', DATA_POINT_RADIUS);
      });

      // Update regression line
      const newLine = line()
        .x(d => this.xScale(d))
        .y(d => intercept + (slope * this.xScale(d)));
      chart.select('.regression-line')
        .datum([minDate, maxDate])
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('d', newLine);
    } else {
      console.log('Props changed');
    }
  }

  /**
   *legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', this.props.dataLineColor[0]);
    const legendText = legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .style('font-size', FONT_SIZE);
    legendText.append('tspan')
      .text('Lugemiskiirus (');
    legendText.append('tspan')
      .attr('class', 'percentage')
      .style('fill', change >= 0 ? 'green' : 'red')
      .text(`${change > 0 ? '+' : ''}${change.toFixed(2)}%`);
    legendText.append('tspan')
      .text(')');
   */

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
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
  dataStrokeColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataFillColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataLineColor: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RegressionChart;
