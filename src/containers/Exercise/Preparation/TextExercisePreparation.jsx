import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Message, Grid, Segment, Icon, Dropdown } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextPreview from '../Preview/TextPreview';

export class TextExercisePreparation extends Component {
  state = {
    textSelectionOpened: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.exerciseStatus !== 'prepared' && this.props.exerciseStatus === 'prepared') {
      this.props.onProceed();
    }
  }

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  }

  textPreparationHandler = () => {
    this.props.onExercisePrepare(this.props.selectedText, this.props.exerciseOptions);
  }

  render() {
    const selectedText = this.props.selectedText ?
      <span>{this.props.translate('text-exercise-preparation.title')}: <b>{this.props.selectedText.title}</b></span> :
      <b>{this.props.translate('text-exercise-preparation.text-not-selected')}</b>;
    const modificationOptions = [
      { key: 'default', text: this.props.translate('exercises.modification-default'), value: 'default' },
    ];
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Grid stackable>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={10}>
              <Header as="h2" content={this.props.translate(`exercises.title-${this.props.type}`)} />
            </Grid.Column>
            <Grid.Column width={6}>
              {this.props.translate('text-exercise-preparation.exercise-modification')}
              <Dropdown
                fluid
                selection
                scrolling
                value={this.props.exerciseModification}
                options={modificationOptions}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={14}>
              {this.props.translate(`exercises.description-${this.props.type}`)}
            </Grid.Column>
            <Grid.Column width={2} verticalAlign="bottom">
              <Button
                positive
                floated="right"
                loading={this.props.exerciseStatus === 'preparing'}
                disabled={!this.props.selectedText || this.props.exerciseStatus === 'preparing'}
                onClick={this.textPreparationHandler}
                content={this.props.translate('text-exercise-preparation.proceed')}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment clearing>
                <Header as="h4" textAlign="center">
                  {this.props.translate('text-exercise-preparation.text-selection')}
                </Header>
                {selectedText}
                <Button
                  primary
                  floated="right"
                  onClick={this.textSelectionToggleHandler}
                  content={this.props.selectedText ?
                    this.props.translate('text-exercise-preparation.change-text') :
                    this.props.translate('text-exercise-preparation.select-text')}
                />
                {this.state.textSelectionOpened ?
                  <TextSelection
                    open={this.state.textSelectionOpened}
                    onClose={this.textSelectionToggleHandler}
                  /> : null}
              </Segment>
            </Grid.Column>
          </Grid.Row>
          {this.props.info.exerciseSettingsInfo ?
            <Grid.Row columns={1}>
              <Grid.Column>
                <Message info onDismiss={this.props.onExerciseSettingsInfoDismiss}>
                  <Icon name="settings" size="large" />
                  {this.props.translate('text-exercise-preparation.info-content')}
                </Message>
              </Grid.Column>
            </Grid.Row> : null}
        </Grid>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('text-exercise-preparation.exercise-options')}
                </Header>
                {this.props.visibleSpeedOptions.length === 0 && this.props.visibleExerciseOptions.length === 0 ?
                  this.props.translate('text-exercise-preparation.exercise-options-missing') :
                  <table>
                    <tbody>
                      <SpeedOptions />
                      <ExerciseOptions />
                    </tbody>
                  </table>
                }
                {this.props.visibleSpeedOptions.length !== 0 && this.props.info.speedChangeInfo ?
                  <Message info onDismiss={this.props.onSpeedChangeInfoDismiss}>
                    {this.props.translate('text-exercise-preparation.keyboard-keys')}
                    <Icon style={{ marginRight: 0 }} size="large" color="black" name="plus square outline" />
                    {this.props.translate('text-exercise-preparation.and')}
                    <Icon style={{ marginRight: 0 }} size="large" color="black" name="minus square outline" />
                    {this.props.translate('text-exercise-preparation.can-be-used')}
                  </Message> : null}
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('text-exercise-preparation.text-options')}
                </Header>
                {this.props.visibleTextOptions.length === 0 ?
                  this.props.translate('text-exercise-preparation.text-options-missing') :
                  <table>
                    <tbody>
                      <TextOptions exerciseType={this.props.type} />
                    </tbody>
                  </table>
                }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <TextPreview />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  info: state.info,
  selectedText: state.text.selectedText,
  exerciseModification: state.exercise.modification,
  exerciseOptions: state.options.exerciseOptions,
  visibleTextOptions: state.options.visibleTextOptions,
  visibleExerciseOptions: state.options.visibleExerciseOptions,
  visibleSpeedOptions: state.options.visibleSpeedOptions,
  exerciseStatus: state.exercise.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExerciseSettingsInfoDismiss: () => {
    dispatch(actionCreators.dismissExerciseSettingsInfo());
  },
  onSpeedChangeInfoDismiss: () => {
    dispatch(actionCreators.dismissSpeedChangeInfo());
  },
  onExercisePrepare: (text, characterCount) => {
    dispatch(actionCreators.prepareExercise(text, characterCount));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
