import React, { Component, Fragment } from 'react';

import { stopPropagation, serverErrorMessage } from '../../shared/utility';
import ErrorPopup from '../../containers/ErrorPopup/ErrorPopup';

const withErrorHandler = (WrappedComponent, axios) => class extends Component {
  state = { error: null }

  componentWillMount() {
    this.reqInterceptor = axios.interceptors.request.use((request) => {
      this.setState({ error: null });
      return request;
    });
    this.resInterceptor = axios.interceptors.response.use(response => response, (error) => {
      this.setState({ error });
      throw error;
    });
  }

  componentWillUnmount() {
    axios.interceptors.request.eject(this.reqInterceptor);
    axios.interceptors.response.eject(this.resInterceptor);
  }

  errorConfirmedHandler = (event) => {
    stopPropagation(event);
    this.setState({ error: null });
  }

  render() {
    const errorMessage = this.state.error ? serverErrorMessage(this.state.error) : 'Unknown error';
    return (
      <Fragment>
        <ErrorPopup
          open={this.state.error !== null}
          onClose={this.errorConfirmedHandler}
          errorMessage={errorMessage}
        />
        <WrappedComponent {...this.props} />
      </Fragment>
    );
  }
};

export default withErrorHandler;
