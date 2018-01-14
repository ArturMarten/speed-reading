import React, {Component} from 'react';
import {scaleLinear, scaleTime} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {line} from 'd3-shape';

class RegressionChart extends Component {
  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.init();
    // this.createBarChart();
  }

  componentDidUpdate() {
    // this.createBarChart();
    this.update();
  }

  init() {
    this.xScale = scaleTime().domain([new Date(2017, 8, 1), new Date(2018, 5, 5)]).range([30, 1000]);
    this.yScale = scaleLinear().domain([500, 0]).range([20, 380]);
    const xAxis = axisBottom().scale(this.xScale);
    const yAxis = axisLeft().scale(this.yScale).ticks(5);

    const svg = this.svg;
    // Append data points
    this.dataPoints = select(svg).append('g');
    this.dataPoints.attr('id', 'circles').selectAll('circle')
    .data(this.props.data).enter().append('circle').attr('class', 'dot')
    .attr('cx', function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this))
    .attr('cy', function(d) {
      return this.yScale(d.wpm);
    }.bind(this))
    .attr('r', 5);
    // Append axis
    this.xAxis = select(svg).append('g');
    this.xAxis.attr('class', 'x axis').attr('transform', 'translate(0, ' + 380 + ')').call(xAxis)
      .append('text').attr('class', 'label').style('fill', 'black')
      .attr('y', -6).attr('x', '1000').style('text-anchor', 'end').text('Date');
    this.yAxis = select(svg).append('g');
    this.yAxis.attr('class', 'y axis').attr('transform', 'translate(' + 30 + ', 0)').call(yAxis)
      .append('text').attr('class', 'label').style('fill', 'black').attr('transform', 'rotate(-90)')
      .attr('y', 6).attr('x', -20).attr('dy', '.60em').style('text-anchor', 'end').text('Words Per Minute');

    const xSeries = this.props.data.map(function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this));
    const ySeries = this.props.data.map(function(d) {
      return this.yScale(d.wpm);
    }.bind(this));

    const leastSquaresCoeff = this.leastSquares(xSeries, ySeries);
    const newLine = line()
    .x(function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this))
    .y(function(d) {
      return leastSquaresCoeff[1] + this.xScale(new Date(d.date)) * leastSquaresCoeff[0];
    }.bind(this));

    // Append regression line
    this.regressionLine = select(svg).append('path');
    this.regressionLine.attr('class', 'regression-line').datum(this.props.data).attr('d', newLine);
  }

  update() {
    const svg = this.svg;
    // Update existing datapoints
    select(svg).selectAll('circle').data(this.props.data).transition().duration(1000)
    .attr('cx', function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this))
    .attr('cy', function(d) {
      return this.yScale(d.wpm);
    }.bind(this));

    // Update existing regression line
    const xSeries = this.props.data.map(function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this));
    const ySeries = this.props.data.map(function(d) {
      return this.yScale(d.wpm);
    }.bind(this));
    // Calculate new coefficients
    const leastSquaresCoeff = this.leastSquares(xSeries, ySeries);
    const newLine = line()
    .x(function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this))
    .y(function(d) {
      return leastSquaresCoeff[1] + this.xScale(new Date(d.date)) * leastSquaresCoeff[0];
    }.bind(this));
    this.regressionLine.attr('class', 'regression-line').datum(this.props.data).transition().duration(1000).attr('d', newLine);

    // Remove old
    select(svg).selectAll('circle').data(this.props.data).exit().remove();
    // Add new ones
    select(svg).selectAll('circle').data(this.props.data).enter().append('circle').attr('class', 'dot')
    .attr('cx', function(d) {
      return this.xScale(new Date(d.date));
    }.bind(this))
    .attr('cy', function(d) {
      return this.yScale(d.wpm);
    }.bind(this))
    .attr('r', 5);
  }

  leastSquares(xSeries, ySeries) {
    const reduceSumFunc = (prev, cur) => prev + cur;
    const xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    const yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    const ssXX = xSeries.map(function(d) {
      return Math.pow(d - xBar, 2);
    }).reduce(reduceSumFunc);

    const ssYY = ySeries.map(function(d) {
      return Math.pow(d - yBar, 2);
    }).reduce(reduceSumFunc);

    const ssXY = xSeries.map(function(d, i) {
      return (d - xBar) * (ySeries[i] - yBar);
    }).reduce(reduceSumFunc);

    const slope = ssXY / ssXX;
    const intercept = yBar - (xBar * slope);
    const rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
  }

  createBarChart() {
    const svg = this.svg;
    const dataMax = max(this.props.data);
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]]);
    select(svg)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect');

    select(svg)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove();

    select(svg)
      .selectAll('rect')
      .data(this.props.data)
      .style('fill', '#fe9922')
      .attr('x', (d, i) => i * 25)
      .attr('y', (d) => this.props.size[1] - yScale(d))
      .attr('height', (d) => yScale(d))
      .attr('width', 25);
   }

  render() {
    return (
      <svg ref={(svg) => this.svg = svg}
        width={1000} height={400}>
      </svg>
    );
  }
}

export default RegressionChart;
