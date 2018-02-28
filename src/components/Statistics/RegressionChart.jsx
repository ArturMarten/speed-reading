import React, { Component } from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
// eslint-disable-next-line no-unused-vars
import { transition } from 'd3-transition';
import { line } from 'd3-shape';
import './RegressionChart.css';

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

class RegressionChart extends Component {
  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.update();
  }

  init() {
    this.xScale = scaleTime().domain([new Date(2017, 8, 1), new Date(2018, 5, 5)]).range([30, 1000]);
    this.yScale = scaleLinear().domain([500, 0]).range([20, 380]);
    const xAxis = axisBottom().scale(this.xScale);
    const yAxis = axisLeft().scale(this.yScale).ticks(5);

    const { svg } = this;
    // Append data points
    this.dataPoints = select(svg).append('g');
    this.dataPoints.attr('id', 'circles').selectAll('circle')
      .data(this.props.data).enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => this.xScale(new Date(d.date)))
      .attr('cy', d => this.yScale(d.wpm))
      .attr('r', 5);
    // Append axis
    this.xAxis = select(svg).append('g');
    this.xAxis.attr('class', 'x axis').attr('transform', `translate(0, ${380})`).call(xAxis)
      .append('text')
      .attr('class', 'label')
      .style('fill', 'black')
      .attr('y', -6)
      .attr('x', '1000')
      .style('text-anchor', 'end')
      .text(this.props.translate('statistics.date'));
    this.yAxis = select(svg).append('g');
    this.yAxis.attr('class', 'y axis').attr('transform', `translate(${30}, 0)`).call(yAxis)
      .append('text')
      .attr('class', 'label')
      .style('fill', 'black')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('x', -20)
      .attr('dy', '.60em')
      .style('text-anchor', 'end')
      .text(this.props.translate('statistics.wpm'));

    const xSeries = this.props.data.map(d => this.xScale(new Date(d.date)));
    const ySeries = this.props.data.map(d => this.yScale(d.wpm));

    const leastSquaresCoeff = leastSquares(xSeries, ySeries);
    const newLine = line()
      .x(d => this.xScale(new Date(d.date)))
      .y(d => leastSquaresCoeff[1] + (this.xScale(new Date(d.date)) * leastSquaresCoeff[0]));

    // Append regression line
    this.regressionLine = select(svg).append('path');
    this.regressionLine.attr('class', 'regression-line').datum(this.props.data).attr('d', newLine);
  }

  update() {
    const { svg } = this;
    // Update existing datapoints
    select(svg).selectAll('circle').data(this.props.data).transition()
      .duration(1000)
      .attr('cx', d => this.xScale(new Date(d.date)))
      .attr('cy', d => this.yScale(d.wpm));

    // Update existing regression line
    const xSeries = this.props.data.map(d => this.xScale(new Date(d.date)));
    const ySeries = this.props.data.map(d => this.yScale(d.wpm));
    // Calculate new coefficients
    const leastSquaresCoeff = leastSquares(xSeries, ySeries);
    const newLine = line()
      .x(d => this.xScale(new Date(d.date)))
      .y(d => leastSquaresCoeff[1] + (this.xScale(new Date(d.date)) * leastSquaresCoeff[0]));
    this.regressionLine.attr('class', 'regression-line').datum(this.props.data).transition().duration(1000)
      .attr('d', newLine);

    // Remove old
    select(svg).selectAll('circle').data(this.props.data).exit()
      .remove();
    // Add new ones
    select(svg).selectAll('circle').data(this.props.data).enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => this.xScale(new Date(d.date)))
      .attr('cy', d => this.yScale(d.wpm))
      .attr('r', 5);
  }


  render() {
    return (
      <svg
        ref={(svg) => { this.svg = svg; }}
        width={1000}
        height={400}
      />
    );
  }
}

export default RegressionChart;
