import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { range, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

const margin = {
  top: 30,
  right: 5,
  bottom: 35,
  left: 40,
};

export class BarChart extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { widthScale, heightScale } = prevState;

    const width = nextProps.width - margin.left - margin.right;
    const height = nextProps.height - margin.top - margin.bottom;

    const xValues = nextProps.data.map(d => d.x);
    const yValues = nextProps.data.map(d => d.y);

    widthScale
      .domain(range(Math.min(...xValues), Math.max(...xValues) + 1))
      .range([0, width]);

    heightScale
      .domain([max(yValues), 0])
      .range([0, height]);

    return {
      ...prevState,
      width,
      height,
      widthScale,
      heightScale,
    };
  }

  state = {
    width: this.props.width - margin.left - margin.right,
    height: this.props.height - margin.top - margin.bottom,
    widthScale: scaleBand()
      .range([0, this.props.width - margin.left - margin.right]),
    heightScale: scaleLinear()
      .range([0, this.props.height - margin.top - margin.bottom]),
  }

  render() {
    const { data } = this.props;
    const {
      widthScale,
      heightScale,
      height,
      width,
    } = this.state;

    return (
      <svg width={this.props.width} height={this.props.height}>
        <text transform="translate(0, 10)" fontWeight="bold">
          {this.props.title}
        </text>
        <g
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <g
            ref={node => select(node).call(axisLeft(heightScale).tickFormat(format('.0f')))}
          />
          <text transform="rotate(-90)" y="-30" x={-height / 2} textAnchor="middle">
            {this.props.yLabel}
          </text>
          <g
            transform={`translate(0, ${height})`}
            ref={node => select(node).call(axisBottom(widthScale))}
          />
          <text y={height + 30} x={width / 2} textAnchor="middle">
            {this.props.xLabel}
          </text>
          {data.map(d => (
            <rect
              key={d.id}
              fill={this.props.fill || 'black'}
              x={widthScale(d.x) + 1}
              y={heightScale(d.y)}
              width={widthScale.bandwidth() - 2}
              height={height - heightScale(d.y)}
            />
          ))}
        </g>
      </svg>
    );
  }
}

export default BarChart;
