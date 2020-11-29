import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSymbolDimensions } from '../../../../shared/utility';

import './SchulteTables.css';

export class SchulteTables extends Component {
  state = {};

  render() {
    const { tableSize, tableDimensions } = this.props.exerciseOptions;
    const { symbolSize } = this.props.textOptions;
    const [rows, columns] = getSymbolDimensions(tableDimensions);
    return (
      <div
        className="schulte-table"
        style={{
          fontFamily: this.props.textOptions.font,
          gridTemplateColumns: `repeat(${columns}, ${(90 / 6) * (tableSize / 100)}vmin)`,
          gridTemplateRows: `repeat(${rows}, ${(90 / 6) * (tableSize / 100)}vmin)`,
          fontSize: `${14 * (symbolSize / 100) * (tableSize / 100)}vmin`,
        }}
      >
        {this.props.symbols.map((e) => (
          <div key={e} className="schulte-cell">
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

const mapStateToProps = (state) => ({
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
  symbols: state.exercise.symbols,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SchulteTables);
