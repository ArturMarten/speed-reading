import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Concentration extends Component {
  state = {};
  render() {
    return (
      <div>Concentration</div>
    );
  }
}

const mapStateToProps = state => ({
  textOptions: state.options.textOptions,
  exerciseOptions: state.options.exerciseOptions,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Concentration);
