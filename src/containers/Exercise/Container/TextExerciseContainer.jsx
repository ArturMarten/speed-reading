import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseResults from './TextExerciseResults';
import TextExerciseTest from '../Test/TextExerciseTest';
import TestResults from './TestResults';

export const Status = {
  Preparation: 0,
  Exercise: 1,
  Test: 2,
};

export class TextExerciseContainer extends Component {
  state = {
    status: Status.Preparation,
    exerciseResults: false,
    testResults: false,
    finished: false,
  };

  componentDidMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.exerciseFinished && this.props.exerciseFinished) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ exerciseResults: true });
    }
    if (!prevProps.testFinished && this.props.testFinished) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ testResults: true });
    }
  }

  onFinish = () => {
    this.setState({ finished: true });
  }

  getCurrentView() {
    switch (this.state.status) {
      case Status.Preparation: {
        return (
          <TextExercisePreparation
            type={this.props.type}
            onProceed={() => this.switchViewHandler(Status.Exercise)}
          />
        );
      }
      case Status.Exercise: {
        return (
          <TextExercise
            type={this.props.type}
          />
        );
      }
      case Status.Test: {
        return (
          <TextExerciseTest />
        );
      }
      default:
        return null;
    }
  }

  switchViewHandler = (status) => {
    this.setState({ status, exerciseResults: false });
  }

  render() {
    let finishRedirect = null;
    if (this.state.finished) {
      finishRedirect = <Redirect to="/" />;
    }
    return (
      <Fragment>
        {finishRedirect}
        {this.state.exerciseResults ?
          <TextExerciseResults
            open={this.state.exerciseResults}
            onProceed={() => this.switchViewHandler(Status.Test)}
            onFinish={this.onFinish}
          /> : null}
        {this.state.testResults ?
          <TestResults
            open={this.state.testResults}
            onFinish={this.onFinish}
          /> : null}
        {this.getCurrentView()}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  exerciseFinished: state.exercise.finished,
  testFinished: state.test.finished,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.selectExercise(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseContainer);
