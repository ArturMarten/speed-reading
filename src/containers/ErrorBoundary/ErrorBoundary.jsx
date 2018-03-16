import React, { Component } from 'react';
import { connect } from 'react-redux';

import ErrorPopup from '../ErrorPopup/ErrorPopup';

export class ErrorBoundary extends Component {
  state = { error: null };

  componentDidCatch(error) {
    this.setState({ error });
  }

  errorConfirmedHandler = () => {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error !== null) {
      const errorMessage = this.state.error ? this.state.error.message : 'Unknown';
      return (<ErrorPopup
        open={this.state.error !== null}
        onClose={this.errorConfirmedHandler}
        errorMessage={errorMessage}
      />);
    }
    return this.props.children;
  }
}

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => ({
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
