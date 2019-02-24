import React, { Component } from 'react';
import { scaleOrdinal } from 'd3-scale';
import { arc as d3Arc, pie as d3Pie } from 'd3-shape';

import { reduceSumFunc } from '../../shared/utility';

const margin = {
  top: 30,
  right: 10,
  bottom: 10,
  left: 10,
};

const color = scaleOrdinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

export class PieChart extends Component {
  state = {
    width: this.props.width - margin.left - margin.right,
    height: this.props.height - margin.top - margin.bottom,
    radius: Math.min(this.props.width - margin.left - margin.right, this.props.height - margin.top - margin.bottom) / 2,
    totalCount: -1,
  };

  componentDidMount() {
    this.calculateTotalCount();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.calculateTotalCount();
    }
  }

  calculateTotalCount = () => {
    if (this.props.data !== null && this.state.totalCount === -1) {
      const totalCount = this.props.data.map((data) => data.y).reduce(reduceSumFunc, 0);
      this.setState({ totalCount });
    }
  };

  render() {
    const { height, width, radius } = this.state;

    const arc = d3Arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);

    const pie = d3Pie()
      .sort(null)
      .value((d) => d.y);

    const pieData = pie(this.props.data);

    return (
      <svg width={width} height={height}>
        <text transform="translate(0, 10)" fontWeight="bold">
          {this.props.title}
        </text>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {pieData.map((d) => (
            <g className="arc" key={d.data.id}>
              <path d={arc(d)} fill={color(d.data.id)} />
              <text transform={`translate(${arc.centroid(d)})`} textAnchor="middle" fontWeight="bold">
                {d.data.y >= this.state.totalCount * 0.08
                  ? `${d.data.x} (${Math.round((d.data.y / this.state.totalCount) * 100)}%)`
                  : null}
              </text>
            </g>
          ))}
        </g>
      </svg>
    );
  }
}

export default PieChart;
