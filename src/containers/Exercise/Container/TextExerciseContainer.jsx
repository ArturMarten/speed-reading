import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseTest from '../Test/TextExerciseTest';

export const Status = {
  Preparation: 0,
  Exercise: 1,
  Test: 2,
};

export class TextExerciseContainer extends Component {
  state = {
    status: Status.Preparation,
    popupOpen: false,
  };

  componentDidMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.timerState.stopped && this.props.timerState.stopped) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ popupOpen: true });
    }
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
    this.setState({ status, popupOpen: false });
  }

  render() {
    return (
      <Fragment>
        {this.getCurrentView()}
        {this.props.selectedText ?
          <Modal open={this.state.popupOpen} size="tiny">
            <Modal.Header>{this.props.translate('exercises.modal-heading')}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>
                <p>
                  {this.props.translate('exercises.modal-result')}: {
                    Math.round(this.props.selectedText.wordCount / (this.props.elapsedTime / (1000 * 60)))
                  }
                </p>
                <p>{this.props.translate('exercises.modal-question')}?</p>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button
                negative
                onClick={() => this.setState({ popupOpen: false })}
                content={this.props.translate('exercises.modal-no')}
              />
              <Button
                positive
                onClick={() => this.switchViewHandler(Status.Test)}
                labelPosition="right"
                icon="checkmark"
                content={this.props.translate('exercises.proceed')}
              />
            </Modal.Actions>
          </Modal> : null
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  selectedText: state.text.selectedText,
  timerState: state.timing.timer,
  elapsedTime: state.timing.elapsedTime,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.exerciseSelected(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseContainer);
