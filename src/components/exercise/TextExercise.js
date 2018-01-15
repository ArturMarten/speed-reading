import React, {Component} from 'react';
import {Container, Grid, Segment, Dimmer, Modal, Button, Divider, Message} from 'semantic-ui-react';

import TextOptionsContainer from '../../containers/TextOptionsContainer';
import ExerciseOptionsContainer from '../../containers/ExerciseOptionsContainer';
import SpeedOptionsContainer from '../../containers/SpeedOptionsContainer';
import TimingContainer from '../../containers/TimingContainer';
import TextPreviewContainer from '../../containers/TextPreviewContainer';
import ReadingContainer from '../../containers/exercise/ReadingContainer';
import DisappearingContainer from '../../containers/exercise/DisappearingContainer';
import OneGroupVisibleContainer from '../../containers/exercise/OneGroupVisibleContainer';
import TextSelectionContainer from '../../containers/TextSelectionContainer';

const TEXT_VERTICAL_PADDING = 15;
const TEXT_HORIZONTAL_PADDING = 70;

export const Status = {
  Preparation: 0,
  Exercise: 1,
  Test: 2
};

class TextExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: Status.Preparation,
      popupOpen: false
    };
    this.exercise = ((props) => {
      switch (props) {
        case 'reading':
          return <ReadingContainer />;
        case 'disappearing':
          return <DisappearingContainer />;
        case 'wordGroup':
          return <OneGroupVisibleContainer />;
      }
    })(this.props.type);
    // console.log(process.env.NODE_ENV === 'development');
  }

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
                  <TextSelectionContainer />
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
            <TextOptionsContainer />
            <ExerciseOptionsContainer />
            <SpeedOptionsContainer />
            <TextPreviewContainer />
          </Container>
        );
      case Status.Exercise:
        return (
          <Container style={{marginTop: '14px'}}>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column textAlign='center' width={8}>
                  <SpeedOptionsContainer />
                </Grid.Column>
                <Grid.Column textAlign='center' width={8}>
                  <TimingContainer />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row centered>
                <Segment compact>
                  <Dimmer.Dimmable blurring
                    dimmed={!this.props.exerciseState.started || this.props.exerciseState.paused || this.props.exerciseState.finished }>
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
    }
  }

  switchViewHandler(status) {
    this.setState({status: status, popupOpen: false});
  }

  componentDidUpdate(previous) {
    if (!previous.exerciseState.finished && this.props.exerciseState.finished) {
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
              <p>{this.props.translate('exercises.modal-result')}: {Math.round(this.props.selectedText.wordCount / (this.props.elapsedTime / (1000 * 60)))}</p>
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

export default TextExercise;
