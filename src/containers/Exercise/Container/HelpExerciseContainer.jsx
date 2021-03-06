import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import HelpExercisePreparation from '../Preparation/HelpExercisePreparation';
import HelpExercise from '../HelpExercise/HelpExercise';
import HelpExerciseResults from '../Results/HelpExerciseResults';

export class HelpExerciseContainer extends Component {
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

  onExerciseEnd = () => {
    this.props.onExerciseEnd();
    this.setState({ finished: true });
  };

  onExerciseRetryHandler = () => {
    this.props.onExerciseEnd();
    this.props.onExerciseRetry();
  };

  getCurrentView() {
    switch (this.state.status) {
      case 'preparation': {
        return <HelpExercisePreparation type={this.props.type} onProceed={this.onPreparationProceed} />;
      }
      case 'exercise': {
        return <HelpExercise type={this.props.type} />;
      }
      default:
        return null;
    }
  }

  render() {
    let finishRedirect = null;
    if (this.state.finished) {
      finishRedirect = <Redirect to="/" />;
    }
    return (
      <Fragment>
        {finishRedirect}
        {this.state.status === 'exercise' && this.props.exerciseStatus === 'finished' ? (
          <HelpExerciseResults
            open={this.state.status === 'exercise' && this.props.exerciseStatus === 'finished'}
            onRetry={this.onExerciseRetryHandler}
            onEnd={this.onExerciseEnd}
          />
        ) : null}
        {this.getCurrentView()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  testStatus: state.exerciseTest.status,
  exerciseStatus: state.exercise.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.selectExercise(type));
  },
  onExerciseRetry: () => {
    dispatch(actionCreators.retryExercise());
  },
  onExerciseEnd: () => {
    dispatch(actionCreators.endExercise());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpExerciseContainer);
