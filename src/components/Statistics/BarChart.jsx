import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { range, max } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

export class BarChart extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    const { widthScale, heightScale } = prevState;

    widthScale.domain(range(Math.min(...nextProps.data.map(d => d.x)), Math.max(...nextProps.data.map(d => d.x))));
    heightScale.domain([0, max(nextProps.data.map(d => d.y))]);

    const derivedState = { ...prevState, widthScale, heightScale };
    return derivedState;
  }

  state = {
    widthScale: scaleBand()
      .domain(range(Math.min(...this.props.data.map(d => d.x)), Math.max(...this.props.data.map(d => d.x))))
      .range([0, this.props.width]),

    heightScale: scaleLinear()
      .domain([0, max(this.props.data.map(d => d.y))])
      .range([0, this.props.height]),
  }

  render() {
    const { x, y, data, height } = this.props;
    const { widthScale, heightScale } = this.state;

    return (
      <svg width="100%" height={this.props.height}>
        <g
          transform={`translate(${x}, ${y})`}
        >
          <g
            transform={`translate(0, ${height})`}
            ref={node => select(node).call(axisBottom(widthScale))}
          />
          {data.map(d => (
            <rect
              key={d.id}
              x={widthScale(d.x)}
              y={height - heightScale(d.y)}
              width={widthScale.bandwidth()}
              height={heightScale(d.y)}
            />
          ))}
        </g>
      </svg>
    );
  }
}

export default BarChart;
