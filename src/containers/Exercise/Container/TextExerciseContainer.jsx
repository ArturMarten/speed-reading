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
    finished: false,
  };

  componentDidMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  onExerciseEnd = () => {
    this.props.onExerciseEnd();
    this.setState({ finished: true });
  }

  onTestEnd = () => {
    this.props.onTestEnd();
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
    this.setState({ status });
  }

  render() {
    let finishRedirect = null;
    if (this.state.finished) {
      finishRedirect = <Redirect to="/" />;
    }
    return (
      <Fragment>
        {finishRedirect}
        {this.state.status === Status.Exercise && this.props.exerciseStatus === 'finished' ?
          <TextExerciseResults
            open={this.state.status === Status.Exercise && this.props.exerciseStatus === 'finished'}
            onProceed={() => this.switchViewHandler(Status.Test)}
            onEnd={this.onExerciseEnd}
          /> : null}
        {this.state.status === Status.Test && this.props.testStatus === 'finished' ?
          <TestResults
            open={this.state.status === Status.Test && this.props.testStatus === 'finished'}
            onEnd={this.onTestEnd}
          /> : null}
        {this.getCurrentView()}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  testStatus: state.test.status,
  exerciseStatus: state.exercise.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.selectExercise(type));
  },
  onExerciseEnd: () => {
    dispatch(actionCreators.endExercise());
  },
  onTestEnd: () => {
    dispatch(actionCreators.endTest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseContainer);
