import React, { Component } from 'react';
import Rheostat from 'rheostat';

import './LabeledSlider.css';

export class LabeledMultipleSlider extends Component {
  state = {
    values: this.props.values || [1, this.props.max],
  };

  componentDidUpdate() {
    if (this.props.min > this.state.values[0] || this.props.max < this.state.values[1]) {
      this.updateValues({ values: [this.props.min, this.props.max] });
    }
  }

  updateValues = (sliderState) => {
    this.setState({
      values: sliderState.values,
    });
  }

  progressBar = color => ({ style, ...passProps }) => (
    <div
      {...passProps}
      style={{
        ...style,
        backgroundColor: color,
      }}
    />
  );

  render() {
    const { formatValues } = this.props;
    const { values } = this.state;
    return (
      <div>
        <Rheostat
          {...this.props}
          onValuesUpdated={this.updateValues}
          values={this.state.values}
          progressBar={this.progressBar(this.props.color || null)}
        />
        {formatValues ? formatValues(values) : null}
      </div>
    );
  }
}

export default LabeledMultipleSlider;
