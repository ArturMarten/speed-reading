import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Grid, Segment, Dimmer, Modal, Button, Divider, Message} from 'semantic-ui-react';
import {getTranslate} from 'react-localize-redux';
import './TextExercise.css';

import * as actionCreators from '../../../store/actions';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import Timing from '../Timing/Timing';
import TextPreview from '../Preview/TextPreview';
import Reading from './Reading';
import Disappearing from './Disappearing';
import OneGroupVisible from './OneGroupVisible';
import TextSelection from '../../TextSelection/TextSelection';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

export const Status = {
  Preparation: 0,
  Exercise: 1,
  Test: 2
};

export class TextExercise extends Component {
  state = {
    status: Status.Preparation,
    popupOpen: false
  };

  exercise = ((props) => {
    switch (props) {
      case 'reading':
        return <Reading />;
      case 'disappearing':
        return <Disappearing />;
      case 'wordGroup':
        return <OneGroupVisible />;
      default:
        return null;
    }
  })(this.props.type);

  componentWillMount() {
    this.props.onExerciseSelect(this.props.type);
  }

  getCurrentView() {
    switch (this.state.status) {
      case Status.Preparation:
        return (
          <Container style={{marginTop: '4em'}}>
            <Grid>
              <Grid.Row columns={3}>
                <Grid.Column width={8}>
                  <h2>{this.props.translate('exercises.title-' + this.props.type)}</h2>
                  <p>{this.props.translate('exercises.description-' + this.props.type)}</p>
                </Grid.Column>
                <Grid.Column width={6}>
                  <TextSelection />
                </Grid.Column>
                <Grid.Column verticalAlign='bottom' width={2}>
                  <Button positive onClick={() => this.switchViewHandler(Status.Exercise)} content={this.props.translate('exercises.proceed')} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider />
            <Message info>
              <p>{this.props.translate('exercises.info-content')}</p>
            </Message>
            <TextOptions />
            <ExerciseOptions />
            <SpeedOptions />
            <TextPreview />
          </Container>
        );
      case Status.Exercise:
        return (
          <Container style={{marginTop: '14px'}}>
            <Grid>
              <Grid.Row verticalAlign='middle' columns={2}>
                <Grid.Column textAlign='center' width={8}>
                  <SpeedOptions />
                </Grid.Column>
                <Grid.Column textAlign='center' width={8}>
                  <Timing />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Segment compact>
                  <Dimmer.Dimmable blurring
                    dimmed={!this.props.timerState.started || this.props.timerState.paused || this.props.timerState.stopped }>
                    <div style={{padding: TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px ' +
                                          TEXT_VERTICAL_PADDING + 'px ' + TEXT_HORIZONTAL_PADDING + 'px'}}>
                        {this.exercise}
                      <div>{this.props.translate('exercises.page')} 1</div>
                    </div>
                  </Dimmer.Dimmable>
                </Segment>
              </Grid.Row>
            </Grid>
          </Container>
        );
      case Status.Test:
        return (
          <Container style={{marginTop: '4em'}}>
            <h2>{this.props.translate('exercises.test-title')}</h2>
            <p>{this.props.translate('exercises.test-description')}</p>
          </Container>
        );
      default:
        return null;
    }
  }

  switchViewHandler(status) {
    this.setState({status: status, popupOpen: false});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.timerState.stopped && this.props.timerState.stopped) {
      this.setState({popupOpen: true});
    }
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
  selectedText: state.exercise.selectedText,
  textOptions: state.exercise.textOptions,
  exerciseOptions: state.exercise.exerciseOptions,
  timerState: state.timing.timer,
  elapsedTime: state.timing.elapsedTime
});

const mapDispatchToProps = (dispatch) => ({
  onExerciseSelect: (type) => {
    dispatch(actionCreators.exerciseSelected(type));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercise);
