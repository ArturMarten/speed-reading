import React, { Component } from 'react';
import { connect } from 'react-redux';
import { environment } from '../../environment';

import * as actionCreators from '../../store/actions';
import { errorData } from '../../utils/errorReporter';
import { actionData } from '../../utils/actionsReporter';
import { updateObject } from '../../shared/utility';
import ErrorPopup from '../ErrorPopup/ErrorPopup';

export class ErrorBoundary extends Component {
  state = { error: null };

  errorConfirmedHandler = () => {
    this.setState({ error: null });
  }

  componentDidCatch(error) {
    const submittedForm = {
      userId: this.props.userId,
      description: error && error.stack ? error.stack.toString() : error.toString(),
      version: environment.version,
      userAgent: window && window.navigator ? window.navigator.userAgent : 'Unknown',
      platform: window && window.navigator ? window.navigator.platform : 'Unknown',
      windowDimensions: window ? [window.innerWidth, window.innerHeight] : [],
      consoleErrors: errorData.getErrors(),
      state: updateObject(this.props.state, { locale: undefined, bugReport: undefined }),
      actions: actionData.getActions(5),
      screenshot: null,
    };
    this.props.onSubmit(submittedForm);
    this.setState({ error });
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
  state,
  userId: state.auth.userId,
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
  onSubmit: (bugReport) => {
    dispatch(actionCreators.sendBugReport(bugReport));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
