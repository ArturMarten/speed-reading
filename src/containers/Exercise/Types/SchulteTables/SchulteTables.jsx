import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SchulteTables.css';

export class SchulteTables extends Component {
  state = {};

  render() {
    const { tableSize } = this.props.exerciseOptions;
    const { symbolSize } = this.props.textOptions;
    return (
      <div
        className="schulte-table"
        style={{
          fontFamily: this.props.textOptions.font,
          width: `${90 * (tableSize / 100)}vmin`,
          height: `${90 * (tableSize / 100)}vmin`,
          fontSize: `${15 * (symbolSize / 100) * (tableSize / 100)}vmin`,
        }}
      >
        {this.props.symbols.map(e => (
          <div
            key={e}
            className="schulte-cell"
            style={{
              width: `${18 * (tableSize / 100)}vmin`,
              height: `${18 * (tableSize / 100)}vmin`,
              lineHeight: `${18 * (tableSize / 100)}vmin`,
            }}
          >
            {e}
          </div>
        ))}
        <div
          className="schulte-center"
          style={{
            width: `${1.5 * (symbolSize / 100) * (tableSize / 100)}vmin`,
            height: `${1.5 * (symbolSize / 100) * (tableSize / 100)}vmin`,
            top: `calc(50% - ${0.75 * (symbolSize / 100) * (tableSize / 100)}vmin)`,
            left: `calc(50% - ${0.75 * (symbolSize / 100) * (tableSize / 100)}vmin)`,
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  symbols: state.exercise.symbols,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SchulteTables);
