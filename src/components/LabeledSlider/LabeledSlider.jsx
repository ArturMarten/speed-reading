import React, { Component } from 'react';
import Slider from 'rc-slider';

import './LabeledSlider.css';

export class LabeledSlider extends Component {
  state = {
    value: this.props.value || this.props.max,
  };

  componentDidUpdate() {
    if (this.props.min > this.state.value) {
      this.onChange(this.props.min);
    } else if (this.props.max < this.state.value) {
      this.onChange(this.props.max);
    }
  }
  onChange = (value) => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    const { formatValue } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Slider
          min={this.props.min}
          max={this.props.max}
          onChange={this.onChange}
          value={value}
          trackStyle={[{ backgroundColor: this.props.color || 'rgb(47, 141, 255)' }]}
        />
        {formatValue ? formatValue(value) : null}
      </div>
    );
  }
}

export default LabeledSlider;
