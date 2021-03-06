import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import * as api from '../../../api';

import * as actionCreators from '../../../store/actions';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseResults from '../Results/TextExerciseResults';
import TextExerciseQuestionTest from '../Test/TextExerciseQuestionTest';
import TextExerciseBlankTest from '../Test/TextExerciseBlankTest';
import TestResults from '../Results/TestResults';
import QuestionTestAnswers from '../TestAnswers/QuestionTestAnswers';
import BlankTestAnswers from '../TestAnswers/BlankTestAnswers';

export class TextExerciseContainer extends Component {
  state = {
    status: 'preparation',
    finished: false,
  };

  componentDidMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  onPreparationProceed = () => {
    this.setState({ status: 'exercise' });
  };

  onExerciseProceed = () => {
    this.setState({ status: 'test' });
  };

  onExerciseEnd = () => {
    this.props.onExerciseEnd();
    this.setState({ finished: true });
  };

  onTestEnd = () => {
    this.props.onTestEnd();
    this.setState({ finished: true });
  };

  onCheckAnswers = () => {
    this.setState({ status: 'testAnswers' });
  };

  onExerciseRetry = () => {
    this.props.onExerciseEnd();
    this.setState({ status: 'preparation' });
  };

  getCurrentView() {
    switch (this.state.status) {
      case 'preparation': {
        return <TextExercisePreparation type={this.props.type} onProceed={this.onPreparationProceed} />;
      }
      case 'exercise': {
        return <TextExercise type={this.props.type} />;
      }
      case 'test': {
        return this.props.selectedText.id ? <TextExerciseQuestionTest /> : <TextExerciseBlankTest />;
      }
      case 'testAnswers': {
        return this.props.selectedText.id ? (
          <QuestionTestAnswers onRetry={this.onExerciseRetry} />
        ) : (
          <BlankTestAnswers onRetry={this.onExerciseRetry} />
        );
      }
      default:
        return null;
    }
  }

  textInterestingnessRating = (interestingnessRating) => {
    api.addTextRating({ readingTextId: this.props.selectedText.id, interestingnessRating }).then(
      () => {},
      (errorMessage) => {
        console.error(errorMessage);
      },
    );
  };

  testDifficultyRating = (difficultyRating) => {
    api.addTestRating({ readingTextId: this.props.selectedText.id, difficultyRating }).then(
      () => {},
      (errorMessage) => {
        console.error(errorMessage);
      },
    );
  };

  render() {
    let finishRedirect = null;
    if (this.state.finished) {
      finishRedirect = <Redirect to="/" />;
    }
    return (
      <Fragment>
        {finishRedirect}
        {this.state.status === 'exercise' && this.props.exerciseStatus === 'finished' ? (
          <TextExerciseResults
            open={this.state.status === 'exercise' && this.props.exerciseStatus === 'finished'}
            onProceed={this.onExerciseProceed}
            onRate={this.textInterestingnessRating}
            onEnd={this.onExerciseEnd}
          />
        ) : null}
        {this.state.status === 'test' && this.props.testStatus === 'finished' ? (
          <TestResults
            open={this.state.status === 'test' && this.props.testStatus === 'finished'}
            onRate={this.testDifficultyRating}
            onCheckAnswers={this.onCheckAnswers}
            onRetry={this.onExerciseRetry}
            onEnd={this.onTestEnd}
          />
        ) : null}
        {this.getCurrentView()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedText: state.text.selectedText,
  testStatus: state.exerciseTest.status,
  exerciseStatus: state.exercise.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
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
