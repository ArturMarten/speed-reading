import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseResults from '../Results/TextExerciseResults';
import TextExerciseTest from '../Test/TextExerciseTest';
import TestResults from '../Results/TestResults';

export class TextExerciseContainer extends Component {
  state = {
    status: 'preparation',
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
      case 'preparation': {
        return (
          <TextExercisePreparation
            type={this.props.type}
            onProceed={() => this.switchViewHandler('exercise')}
          />
        );
      }
      case 'exercise': {
        return (
          <TextExercise
            type={this.props.type}
          />
        );
      }
      case 'test': {
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
        {this.state.status === 'exercise' && this.props.exerciseStatus === 'finished' ?
          <TextExerciseResults
            open={this.state.status === 'exercise' && this.props.exerciseStatus === 'finished'}
            onProceed={() => this.switchViewHandler('test')}
            onEnd={this.onExerciseEnd}
          /> : null}
        {this.state.status === 'test' && this.props.testStatus === 'finished' ?
          <TestResults
            open={this.state.status === 'test' && this.props.testStatus === 'finished'}
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
