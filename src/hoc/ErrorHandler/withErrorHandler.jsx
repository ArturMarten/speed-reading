import React, { Component, Fragment } from 'react';

import { stopPropagation } from '../../shared/utility';
import ErrorPopup from '../../containers/ErrorPopup/ErrorPopup';

const withErrorHandler = (WrappedComponent, axios) =>
  class extends Component {
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
      let errorMessage = this.state.error ? this.state.error.message : 'Unknown error';
      if (this.state.error && this.state.error.response && this.state.error.response.data && this.state.error.response.data.error) {
        errorMessage = this.state.error.response.data.error;
      }
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
