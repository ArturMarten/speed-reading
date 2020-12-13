import React, { Component } from 'react';
import { Range } from 'rc-slider';

import './LabeledSlider.css';

export class LabeledMultipleSlider extends Component {
  state = {
    values: this.props.values || [1, this.props.max],
  };

  componentDidUpdate() {
    if (this.props.min > this.state.values[0] || this.props.max < this.state.values[1]) {
      this.onChange([this.props.min, this.props.max]);
    }
  }

  onChange = (values) => {
    this.setState({ values });
    this.props.onChange(values);
  };

  render() {
    const { formatValues } = this.props;
    const { values } = this.state;
    return (
      <div>
        <Range
          min={this.props.min}
          max={this.props.max}
          onChange={this.onChange}
          value={this.state.values}
          allowCross={false}
          trackStyle={[{ backgroundColor: this.props.color || 'rgb(47, 141, 255)' }]}
        />
        {formatValues ? formatValues(values) : null}
      </div>
    );
  }
}

export default LabeledMultipleSlider;
