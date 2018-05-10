import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import axios from '../../../axios-http';

import * as actionCreators from '../../../store/actions';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseResults from '../Results/TextExerciseResults';
import TextExerciseTest from '../Test/TextExerciseTest';
import TestResults from '../Results/TestResults';
import TestAnswers from '../TestAnswers/TestAnswers';

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
      case 'testAnswers': {
        return (
          <TestAnswers
            testAttemptId={this.props.testAttemptId}
          />
        );
      }
      default:
        return null;
    }
  }

  textComplexityRating = (complexityRating) => {
    axios.post(
      '/textRatings',
      { readingTextId: this.props.selectedText.id, complexityRating }, { headers: { 'x-access-token': this.props.token } },
    )
      .then(() => {
      }, (error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  testDifficultyRating = (difficultyRating) => {
    axios.post(
      '/testRatings',
      { readingTextId: this.props.selectedText.id, difficultyRating }, { headers: { 'x-access-token': this.props.token } },
    )
      .then(() => {
      }, (error) => {
        console.log(error);
      })
      .catch((error) => {
        console.log(error);
      });
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
            onRate={this.textComplexityRating}
            onEnd={this.onExerciseEnd}
          /> : null}
        {this.state.status === 'test' && this.props.testStatus === 'finished' ?
          <TestResults
            open={this.state.status === 'test' && this.props.testStatus === 'finished'}
            onRate={this.testDifficultyRating}
            onCheckAnswers={() => this.switchViewHandler('testAnswers')}
            onEnd={this.onTestEnd}
          /> : null}
        {this.getCurrentView()}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  selectedText: state.text.selectedText,
  testStatus: state.test.status,
  testAttemptId: state.test.attemptId,
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
