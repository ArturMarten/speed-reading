import React, { Component } from 'react';
import { connect } from 'react-redux';

import './SchulteTables.css';

export class SchulteTables extends Component {
  state = {};
  render() {
    return (
      <div className="schulte-table" style={{ fontFamily: this.props.textOptions.font }}>
        {this.props.symbols.map(e =>
          <div key={e} className="schulte-cell">{e}</div>)}
        <div className="schulte-center" />
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
