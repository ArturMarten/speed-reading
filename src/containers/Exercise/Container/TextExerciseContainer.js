import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import TextExercisePreparation from '../Preparation/TextExercisePreparation';
import TextExercise from '../TextExercise/TextExercise';
import TextExerciseTest from '../Test/TextExerciseTest';

export const Status = {
  Preparation: 0,
  Exercise: 1,
  Test: 2
};

export class TextExerciseContainer extends Component {
  state = {
    status: Status.Preparation,
    popupOpen: false
  };

  componentWillMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  getCurrentView() {
    switch (this.state.status) {
      case Status.Preparation:
        return (
          <TextExercisePreparation 
            type={this.props.type}
            onProceed={() => this.switchViewHandler(Status.Exercise)}
          />
        );
      case Status.Exercise:
        return (
          <TextExercise 
            type={this.props.type} 
          />
        );
      case Status.Test:
        return (
          <TextExerciseTest />
        );
      default:
        return null;
    }
  }

  switchViewHandler = (status) => {
    this.setState({status: status, popupOpen: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.timerState.stopped && this.props.timerState.stopped) {
      this.setState({popupOpen: true});
    }
  }

  render() {
    return (
      <Aux>
        {this.getCurrentView()}
        <Modal open={this.state.popupOpen} size='tiny'>
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
            <Modal.Actions>
              <Button negative onClick={() => this.setState({popupOpen: false})}>{this.props.translate('exercises.modal-no')}</Button>
              <Button positive onClick={() => this.switchViewHandler(Status.Test)} labelPosition='right' icon='checkmark'
                content={this.props.translate('exercises.proceed')} />
            </Modal.Actions>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
  selectedText: state.text.selectedText,
  timerState: state.timing.timer,
  elapsedTime: state.timing.elapsedTime
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.exerciseSelected(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseContainer);